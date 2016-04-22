var xmlStr = '<?xml version="1.0" encoding="UTF-8"?>';
var doiBatchStr = '<doi_batch version="4.3.4" xmlns="http://www.crossref.org/schema/4.3.4" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xsi:schemaLocation="http://www.crossref.org/schema/4.3.4 ' +
    'http://www.crossref.org/schema/deposit/crossref4.3.4.xsd">' +
    '{content}' +
    '</doi_batch>';
var headStr = '<head><doi_batch_id>{batchId}</doi_batch_id><timestamp>{timestamp}</timestamp>' +
    '<depositor><depositor_name>scichina</depositor_name><email_address>{recvEmail}</email_address>' +
    '</depositor><registrant>scichina</registrant></head>';
var bodyStr = '<body>{journals}</body>';
var journalStr = '<journal><journal_metadata language="en"><full_title>{journalTitle}</full_title>' +
    '<abbrev_title>{abbrTitle}</abbrev_title><issn media_type="print">{issn}</issn></journal_metadata>' +
    '{articles}</journal>';
var articleStr = '<journal_article publication_type="full_text"><titles><title>{title}</title></titles>' +
    '<publication_date media_type="online"><year>{year}</year></publication_date>' +
    '<doi_data><doi>{doi}</doi><resource>{url}</resource></doi_data></journal_article>';

var updateTask = function (taskId, setobj) {
    Meteor.bindEnvironment(AutoTasks.update({_id: taskId}, {$set: setobj}));
};

var generationXML = function (options, callback) {
    if (!Articles || !Publications) {
        throw new Error('Articles and Publication are required');
    }
    var limit = options.limit || 0;
    var journals = {};
    var articles;
    var query = {$where: "this.doi.indexOf('10.1360/')==0"};
    var inQuery = false;
    var dois = [];
    if (options.dois && typeof options.dois == 'string') {
        options.dois = [options.dois];
    }
    if (options.dois) {
        query = {doi: {$in: options.dois}};
    } else {
        inQuery = true;
        var condition = options.condition || 1;//默认1天
        condition = new Date().addDays(0 - condition);
        //query={$or:[
        //	{"stamps.rdoi":{$exists:false}}, //从未进行过注册的
        //	{"stamps.rdoi":{$lte:condition}} //较早前进行过注册的
        //]};
    }
    var chineseJournals = Publications.find({language: "2"}, {fields: {_id: true, issn: true}}).fetch();
    if (!chineseJournals.length)
        return;
    for (var j = 0; j < chineseJournals.length; j++) {
        //var volumes = Volumes.find({journalId:chineseJournals[j]._id},{fields:{_id:1,volume:1}}).fetch();
        //if(!volumes.length)
        //	return;
        //
        //query.pubStatus="normal";
        //for(var i=0;i<volumes.length;i++){
        query.journalId = chineseJournals[j]._id;
        articles = Articles.find(query, {fields: {journalId: 1, doi: 1, title: 1, year: 1}});
        var count = articles.count();
        if (count == 0) {
            continue;
        }
        options.taskId && AutoTasks.update({_id: options.taskId}, {$set: {status: "splicing"}, $inc: {total: count}});
        journals = {};
        articles.forEach(function (articleInfo) {

            //计数器
            journals.articleCount = (journals.articleCount || 0) + 1;

            inQuery && articleInfo.doi && dois.push(articleInfo.doi);
            //单条article的xml内容
            var title = articleInfo.title.en || articleInfo.title.cn;
            if (title)
                title = title.replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/&/g, '&#38;').replace(/"/g, '&#34;').replace(/'/g, "&#39;");
            articleInfo.xmlContent = JEC.name2Char(articleStr.replace("{title}", title)
                .replace("{year}", articleInfo.year)
                .replace("{doi}", articleInfo.doi)
                .replace("{url}", options.rootUrl + articleInfo.doi));
            //结果集中若没有当前这篇文章所属的期刊，先将这个刊加入结果集。
            if (!journals.hasOwnProperty(articleInfo.journalId)) {
                //查询得到刊的信息
                var journalInfo = Publications.findOne({_id: articleInfo.journalId}, {
                    fields: {
                        title: 1,
                        shortTitle: 1,
                        issn: 1
                    }
                });
                journalInfo.xmlContent = JEC.name2Char(
                    journalStr.replace("{journalTitle}", journalInfo.title.replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/&/g, '&#38;').replace(/"/g, '&#34;').replace(/'/g, "&#39;"))
                        .replace("{abbrTitle}", journalInfo.shortTitle)
                        .replace("{issn}", journalInfo.issn));
                //加入结果集
                journalInfo.articles = [];
                journalInfo.allArticleXmlContent = "";
                journals[articleInfo.journalId] = journalInfo;
            }

            journals[articleInfo.journalId].articles.push(articleInfo);
            journals[articleInfo.journalId].allArticleXmlContent += articleInfo.xmlContent;

            if (journals.articleCount >= count) {//最后一个article处理完以后拼装出完整的xml内容
                //保存本次任务提交的doi集合
                options.taskId && AutoTasks.update({_id: options.taskId}, {$set: {dois: options.dois || dois}});
                delete journals.articleCount;
                var allJournalXmlContent = "";
                _.each(journals, function (journalInfo) {
                    allJournalXmlContent += journalInfo.xmlContent.replace("{articles}", journalInfo.allArticleXmlContent);
                });
                //以当前时间命名准备提交个crossRef的xml文件
                var timestamp = new Date().format("yyyyMMddhhmmss");
                var headContent = headStr.replace("{batchId}", timestamp.substr(0, 8))
                    .replace("{timestamp}", timestamp)
                    .replace("{recvEmail}", options.recvEmail);
                var finallyXmlContent = xmlStr +
                    doiBatchStr.replace("{content}", headContent + bodyStr.replace("{journals}", allJournalXmlContent));
                //保存文件到预定位置，在回调函数中提交给crossRef
                var filePath = Config.AutoTasks.DOI_Register.savePath + chineseJournals[j].issn + "_" + timestamp + ".xml";
                options.taskId && AutoTasks.update({_id: options.taskId}, {$set: {status: "saving"}});
                Science.FSE.outputFile(filePath, finallyXmlContent, Meteor.bindEnvironment(function (err) {
                        if (!err && callback) {
                            options.taskId && AutoTasks.update({_id: options.taskId}, {$set: {status: "saved"}});
                            callback(options.taskId, filePath);
                        } else {
                            options.taskId && AutoTasks.update({_id: options.taskId}, {
                                $set: {
                                    status: "error",
                                    error: err
                                }
                            });
                        }
                    })
                );
            }
        });
        //}
    }
};

var post2CrossRef = function (taskId, filepath) {
    var formData = {
        "operation": "doMDUpload",
        "login_id": "scichina",
        "login_passwd": "scichina1",
        "area": "live",
        "fname": Science.FSE.createReadStream(filepath)
    };
    taskId && AutoTasks.update({_id: taskId}, {$set: {status: "sending"}});
    Science.Request.post({
        url: "https://doi.crossref.org/servlet/deposit",
        formData: formData
    }, Meteor.bindEnvironment(function (err, response, body) {
        if (err) {
            taskId && AutoTasks.update({_id: taskId}, {$set: {status: "error", error: err}});//错误
            return console.error('request to crossref for register failed:', err);
        }
        taskId && AutoTasks.update({_id: taskId}, {$set: {status: "success"}});//已提交
        logger.verbose('request to crossref for register successfully');
        var condition = Config.AutoTasks.DOI_Register.condition || 1;
        condition = new Date().addDays(0 - condition);
        Articles.update({
                $or: [
                    {"stamps.rdoi": {$exists: false}}, //从未进行过注册的
                    {"stamps.rdoi": {$lte: condition}} //较早前进行过注册的
                ]
            }, {$set: {"stamps.rdoi": new Date()}},
            {multi: true});//将本次注册的所有文章的DOI注册时间更新为当前时间。
        logger.verbose('update register time stamp successfully');
    }))
};

var generationXMLForSingleArticle = function (doi, callback) {
    check(doi, String);
    if (!doi.startWith("10.1360/")){
        logger.info("ignore this doi registration, because doi must start with 10.1360/, and the doi is:" + doi);//由于中国科学在CrossRef上机构代号为10.1360所以只有为10.1360开头的doi注册的权限.
        return;
    }

    var article = Articles.findOne({doi:doi}, {fields: {journalId: 1, doi: 1, title: 1, year: 1}});
    if (!article) {
        logger.error("Can't find article with doi:" + doi);
        return;
    }

    var title = article.title.en || article.title.cn;
    if (title)
        title = title.replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/&/g, '&#38;').replace(/"/g, '&#34;').replace(/'/g, "&#39;");
    article.xmlContent = JEC.name2Char(articleStr.replace("{title}", title)
        .replace("{year}", article.year)
        .replace("{doi}", article.doi)
        .replace("{url}", Config.AutoTasks.DOI_Register.rootUrl + doi));

    //结果集中若没有当前这篇文章所属的期刊，先将这个刊加入结果集。
    //查询得到刊的信息
    var journal = Publications.findOne({_id: article.journalId}, {
        fields: {
            title: 1,
            shortTitle: 1,
            issn: 1
        }
    });
    journal.xmlContent = JEC.name2Char(
        journalStr.replace("{journalTitle}", journal.title.replace(/</g, '&#60;').replace(/>/g, '&#62;').replace(/&/g, '&#38;').replace(/"/g, '&#34;').replace(/'/g, "&#39;"))
            .replace("{abbrTitle}", journal.shortTitle)
            .replace("{issn}", journal.issn));
    journal.xmlContent=journal.xmlContent.replace("{articles}",article.xmlContent);
    //以当前时间命名准备提交个crossRef的xml文件
    var timestamp = new Date().format("yyyyMMddhhmmss");
    var headContent = headStr.replace("{batchId}",journal.issn + timestamp)
        .replace("{timestamp}", timestamp)
        .replace("{recvEmail}", Config.AutoTasks.DOI_Register.recvEmail);
    var finallyXmlContent = xmlStr +
        doiBatchStr.replace("{content}", headContent + bodyStr.replace("{journals}", journal.xmlContent));
    //保存文件到预定位置，在回调函数中提交给crossRef
    var filePath = Config.AutoTasks.DOI_Register.savePath + journal.issn + "_" + timestamp + ".xml";

    Science.FSE.outputFile(filePath, finallyXmlContent, Meteor.bindEnvironment(function (err) {
            if (!err && callback) {
                callback(doi,filePath);
            }
        })
    );
};

var post2CrossRefForSingleArticle = function (doi, filepath) {
    var formData = {
        "operation": "doMDUpload",
        "login_id": "scichina",
        "login_passwd": "scichina1",
        "area": "live",
        "fname": Science.FSE.createReadStream(filepath)
    };
    Science.Request.post({
        url: "https://doi.crossref.org/servlet/deposit",
        formData: formData
    }, Meteor.bindEnvironment(function (err, response, body) {
        if (err) {
            logger.error('request to crossref for register failed:'+err);
            return;
        }
        logger.verbose('request to crossref for register successfully');

        Articles.update({doi:doi}, {$set: {"stamps.rdoi": new Date()}});//将本次注册的所有文章的DOI注册时间更新为当前时间。
        logger.verbose('update register time stamp successfully');
    }))
};
/**
 * DOI注册API
 * @param 为单个doi进行注册
 */
Science.Interface.CrossRef.registerOne = function(doi){
    if(_.isString(doi) && Science.DOIValidator({exact: true}).test(doi)){
        generationXMLForSingleArticle(doi,Meteor.bindEnvironment(post2CrossRefForSingleArticle))
    }
}
/**
 * DOI注册API
 * @param jobs 字符串（单个doi），数组（元素为多个doi字符串），Article集合的游标或对象集
 * @param recvEmail 接受通知邮件的邮箱地址
 * @param rootUrl DOI绑定的URL的前缀
 */
Science.Interface.CrossRef.register = function (options) {
    generationXML(options, Meteor.bindEnvironment(post2CrossRef));
};