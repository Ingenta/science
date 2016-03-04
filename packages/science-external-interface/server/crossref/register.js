var xmlStr='<?xml version="1.0" encoding="UTF-8"?>';
var doiBatchStr='<doi_batch version="4.3.4" xmlns="http://www.crossref.org/schema/4.3.4" ' +
	'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
	'xsi:schemaLocation="http://www.crossref.org/schema/4.3.4 ' +
	'http://www.crossref.org/schema/deposit/crossref4.3.4.xsd">' +
	'{content}' +
	'</doi_batch>';
var headStr='<head><doi_batch_id>{batchId}</doi_batch_id><timestamp>{timestamp}</timestamp>'+
	'<depositor><depositor_name>scichina</depositor_name><email_address>{recvEmail}</email_address>'+
	'</depositor><registrant>scichina</registrant></head>';
var bodyStr='<body>{journals}</body>';
var journalStr = '<journal><journal_metadata language="en"><full_title>{journalTitle}</full_title>'+
	'<abbrev_title>{abbrTitle}</abbrev_title><issn media_type="print">{issn}</issn></journal_metadata>' +
	'{articles}</journal>';
var articleStr = '<journal_article publication_type="full_text"><titles><title>{title}</title></titles>'+
	'<publication_date media_type="online"><year>{year}</year></publication_date>'+
	'<doi_data><doi>{doi}</doi><resource>{url}</resource></doi_data></journal_article>';

var updateTask = function(taskId,setobj){
	Meteor.bindEnvironment(AutoTasks.update({_id:taskId},{$set:setobj}));
};

var generationXML = function(options,callback){
	if(!Articles || !Publications){
		throw new Error('Articles and Publication are required');
	}
	var journals = {};
	var articles;
	var query;
	var inQuery=false;
	var dois = [];
	if(options.dois && typeof options.dois == 'string'){
		options.dois = [options.dois];
	}
	if(options.dois){
		query={doi:{$in:options.dois}};
	}else{
		inQuery=true;
		var condition=options.condition || 1;//默认1天
		condition = new Date().addDays(0-condition);
		query={$or:[
			{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
			{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
		]};
	}
	query.pubStatus="normal";
	articles = Articles.find(query,{fields:{journalId:1,doi:1,title:1,year:1},limit:100});

	if(articles.count()==0){
		AutoTasks.update({_id:options.taskId},{$set:{status:"aborted",total:0}});
		logger.verbose("Not found any article for DOI register");
		return;
	}
	options.taskId && AutoTasks.update({_id:options.taskId},{$set:{status:"splicing",total:articles.count()}});

	articles.forEach(function(articleInfo){
		//计数器
		journals.articleCount = (journals.articleCount || 0)+1;

		inQuery && articleInfo.doi && dois.push(articleInfo.doi);
		//单条article的xml内容
		articleInfo.xmlContent = articleStr.replace("{title}",articleInfo.title.en || articleInfo.title.cn)
			.replace("{year}",articleInfo.year)
			.replace("{doi}",articleInfo.doi)
			.replace("{url}",options.rootUrl + articleInfo.doi);//TODO  最终的url待确认
		//结果集中若没有当前这篇文章所属的期刊，先将这个刊加入结果集。
		if(!journals.hasOwnProperty(articleInfo.journalId)){
			//查询得到刊的信息
			var journalInfo = Publications.findOne({_id:articleInfo.journalId},{fields:{title:1,shortTitle:1,issn:1}});
			journalInfo.xmlContent = journalStr.replace("{journalTitle}",journalInfo.title)
				.replace("{abbrTitle}",journalInfo.shortTitle)
				.replace("{issn}",journalInfo.issn);
			//加入结果集
			journalInfo.articles=[];
			journalInfo.allArticleXmlContent="";
			journals[articleInfo.journalId]=journalInfo;
		}

		journals[articleInfo.journalId].articles.push(articleInfo);
		journals[articleInfo.journalId].allArticleXmlContent+=articleInfo.xmlContent;

		if(journals.articleCount>= articles.count()){//最后一个article处理完以后拼装出完整的xml内容
			//保存本次任务提交的doi集合
			options.taskId && AutoTasks.update({_id:options.taskId},{$set:{dois:options.dois || dois}});
			delete journals.articleCount;
			var allJournalXmlContent="";
			_.each(journals,function(journalInfo){
				allJournalXmlContent+= journalInfo.xmlContent.replace("{articles}",journalInfo.allArticleXmlContent);
			});
			//以当前时间命名准备提交个crossRef的xml文件
			var timestamp = new Date().format("yyyyMMddhhmmss");
			var headContent = headStr.replace("{batchId}",timestamp.substr(0,8))
				.replace("{timestamp}",timestamp)
				.replace("{recvEmail}",options.recvEmail);
			var finallyXmlContent = xmlStr+
				doiBatchStr.replace("{content}",headContent + bodyStr.replace("{journals}",allJournalXmlContent));
			//保存文件到预定位置，在回调函数中提交给crossRef
			var filePath = Config.AutoTasks.DOI_Register.savePath+timestamp +".xml";
			options.taskId && AutoTasks.update({_id:options.taskId},{$set:{status:"saving"}});
			Science.FSE.outputFile(filePath,finallyXmlContent,Meteor.bindEnvironment(function(err){
					if(!err && callback){
						options.taskId && AutoTasks.update({_id:options.taskId},{$set:{status:"saved"}});
						callback(options.taskId,filePath);
					}else{
						options.taskId && AutoTasks.update({_id:options.taskId},{$set:{status:"error",error:err}});
					}
				})
			);
		}
	});

};

var post2CrossRef =function(taskId,filepath){
	var formData={
		"operation":"doMDUpload",
		"login_id":"scichina",
		"login_passwd":"scichina1",
		"area":"live",
		"fname":Science.FSE.createReadStream(filepath)
	};
	taskId && AutoTasks.update({_id:taskId},{$set:{status:"sending"}});
	Science.Request.post({url:"https://doi.crossref.org/servlet/deposit",formData: formData},Meteor.bindEnvironment(function(err,response,body){
		if (err) {
			taskId && AutoTasks.update({_id:taskId},{$set:{status:"error",error:err}});//错误
			return console.error('request to crossref for register failed:', err);
		}
		taskId && AutoTasks.update({_id:taskId},{$set:{status:"success"}});//已提交
		logger.verbose('request to crossref for register successfully');
		var condition=Config.AutoTasks.DOI_Register.condition || 1;
		condition = new Date().addDays(0-condition);
		Articles.update({$or:[
			{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
			{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
		]},{$set:{"stamps.rdoi":new Date()}},
			{multi:true});//将本次注册的所有文章的DOI注册时间更新为当前时间。
		logger.verbose('update register time stamp successfully');
	}))
};

/**
 * DOI注册API
 * @param jobs 字符串（单个doi），数组（元素为多个doi字符串），Article集合的游标或对象集
 * @param recvEmail 接受通知邮件的邮箱地址
 * @param rootUrl DOI绑定的URL的前缀
 */
Science.Interface.CrossRef.register = function(options){
	generationXML(options,Meteor.bindEnvironment(post2CrossRef));
};