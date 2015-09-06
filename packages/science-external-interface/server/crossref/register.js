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

var generationXML = function(doiArr, recvEmail, rootUrl,callback){
	if(!Articles || !Publications){
		throw new Error('Articles and Publication are required');
	}
	var journals = {};
	if(typeof doiArr == 'string'){
		doiArr = [doiArr];
	}
	_.each(doiArr,function(item){
		var articleInfo = Articles.findOne({doi:item},{fields:{journalId:1,doi:1,title:1,year:1}});
		if(articleInfo){
			articleInfo.htmlContent = articleStr.replace("{title}",articleInfo.title.en)
				.replace("{year}",articleInfo.year)
				.replace("{doi}",articleInfo.doi)
				.replace("{url}",rootUrl + articleInfo.doi);//TODO  最终的url待确认
			if(!journals.hasOwnProperty(articleInfo.journalId)){
				var journalInfo = Publications.findOne({_id:articleInfo.journalId},{fields:{title:1,shortTitle:1,issn:1}});
				journalInfo.htmlContent = journalStr.replace("{journalTitle}",journalInfo.title)
					.replace("{abbrTitle}",journalInfo.shortTitle)
					.replace("{issn}",journalInfo.issn);
				journals[articleInfo.journalId]=journalInfo;
			}
			if(!journals[articleInfo.journalId].hasOwnProperty('articles')){
				journals[articleInfo.journalId].articles=[];
				journals[articleInfo.journalId].allArticleHtmlContent="";
			}
			journals[articleInfo.journalId].articles.push(articleInfo);
			journals[articleInfo.journalId].allArticleHtmlContent+=articleInfo.htmlContent;
		}
	});
	var allJournalHtmlContent="";
	_.each(journals,function(item){
		allJournalHtmlContent+= item.htmlContent.replace("{articles}",item.allArticleHtmlContent);
	});

	var timestamp = new Date().format("yyyyMMddhhmmss");
	var headContent = headStr.replace("{batchId}",timestamp.substr(0,8))
		.replace("{timestamp}",timestamp)
		.replace("{recvEmail}",recvEmail);
	var finallyHtmlContent = xmlStr+
		doiBatchStr.replace("{content}",headContent + bodyStr.replace("{journals}",allJournalHtmlContent));
	Science.FSE.outputFile(Config.DOI_Register.savePath+timestamp +".xml",finallyHtmlContent,function(err){
		if(!err && callback){
			callback(Config.DOI_Register.savePath+timestamp +".xml");
		}
	});
};

var post2CrossRef =function(filepath){
	var formData={
		"operation":"doMDUpload",
		"login_id":"scichina",
		"login_passwd":"scichina1",
		"area":"live",
		"fname":fs.createReadStream(filepath)
	}
	Science.Request.post({url:"https://doi.crossref.org/servlet/deposit",formData: formData},function(err,response,body){
		if (err) {
			return console.error('upload failed:', err);
		}
		console.log('Upload successful!  Server responded with:', body);
	})
};
Science.Interface.CrossRef.register = function(doiArr, recvEmail, rootUrl){
	generationXML(doiArr,recvEmail,rootUrl,post2CrossRef)
};

//Meteor.startup(function(){
//	Science.Interface.CrossRef.register('10.1063/1.0000004','kai.jiang@digitalpublishing.cn','http://phys.scichina.com:8083/sciG/CN/');
//})