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

var generationXML = function(dois, recvEmail, rootUrl,callback){
	if(!Articles || !Publications){
		throw new Error('Articles and Publication are required');
	}
	var journals = {};
	var articles;
	var query;
	if(dois && typeof dois == 'string'){
		dois = [dois];
	}
	if(dois){
		query={doi:{$in:dois}};
	}else{
		var condition=Config.AutoTasks.DOI_Register.condition || 1;
		condition = new Date().addDays(0-condition);
		query={$or:[
			{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
			{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
		]};
	}
	articles = Articles.find(query,{fields:{journalId:1,doi:1,title:1,year:1}});
	if(articles.count()==0){
		console.log("Not found any article for DOI register");
		return;
	}
	articles.forEach(function(articleInfo){
		journals.articleCount = (journals.articleCount || 0)+1;
		articleInfo.xmlContent = articleStr.replace("{title}",articleInfo.title.en || articleInfo.title.cn)
			.replace("{year}",articleInfo.year)
			.replace("{doi}",articleInfo.doi)
			.replace("{url}",rootUrl + articleInfo.doi);//TODO  最终的url待确认
		if(!journals.hasOwnProperty(articleInfo.journalId)){
			var journalInfo = Publications.findOne({_id:articleInfo.journalId},{fields:{title:1,shortTitle:1,issn:1}});
			journalInfo.xmlContent = journalStr.replace("{journalTitle}",journalInfo.title)
				.replace("{abbrTitle}",journalInfo.shortTitle)
				.replace("{issn}",journalInfo.issn);
			journals[articleInfo.journalId]=journalInfo;
		}
		if(!journals[articleInfo.journalId].hasOwnProperty('articles')){
			journals[articleInfo.journalId].articles=[];
			journals[articleInfo.journalId].allArticleXmlContent="";
		}
		journals[articleInfo.journalId].articles.push(articleInfo);
		journals[articleInfo.journalId].allArticleXmlContent+=articleInfo.xmlContent;

		if(journals.articleCount>= articles.count()){//最后一个article处理完以后拼装出完整的xml内容
			delete journals.articleCount;
			var allJournalXmlContent="";
			_.each(journals,function(journalInfo){
				allJournalXmlContent+= journalInfo.xmlContent.replace("{articles}",journalInfo.allArticleXmlContent);
			});
			//以当前时间命名准备提交个crossRef的xml文件
			var timestamp = new Date().format("yyyyMMddhhmmss");
			var headContent = headStr.replace("{batchId}",timestamp.substr(0,8))
				.replace("{timestamp}",timestamp)
				.replace("{recvEmail}",recvEmail);
			var finallyXmlContent = xmlStr+
				doiBatchStr.replace("{content}",headContent + bodyStr.replace("{journals}",allJournalXmlContent));
			//保存文件到预定位置，在回调函数中提交给crossRef
			var filePath = Config.AutoTasks.DOI_Register.savePath+timestamp +".xml";
			Science.FSE.outputFile(filePath,finallyXmlContent,function(err){
				if(!err && callback){
					callback(filePath);
				}
			});
		}
	});

};

var post2CrossRef =function(filepath){
	var formData={
		"operation":"doMDUpload",
		"login_id":"scichina",
		"login_passwd":"scichina1",
		"area":"live",
		"fname":Science.FSE.createReadStream(filepath)
	};
	console.log(filepath);
	Science.Request.post({url:"https://doi.crossref.org/servlet/deposit",formData: formData},Meteor.bindEnvironment(function(err,response,body){
		if (err) {
			return console.error('request to crossref for register failed:', err);
		}
		console.log('request to crossref for register successfully');
		var condition=Config.AutoTasks.DOI_Register.condition || 1;
		condition = new Date().addDays(0-condition);
		Articles.update({$or:[
			{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
			{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
		]},{$set:{"stamps.rdoi":new Date()}},{multi:true});//将本次注册的所有文章的DOI注册时间更新为当前时间。
		console.log('update register time stamp successfully');
	}))
};
Science.Interface.CrossRef.register = function(jobs, recvEmail, rootUrl){
	generationXML(jobs,recvEmail,rootUrl,Meteor.bindEnvironment(post2CrossRef));
};