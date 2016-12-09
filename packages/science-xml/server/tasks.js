Tasks = {};

Tasks.startJob = function (pathToFile, fileName, fileType, formFields) {
    if (!pathToFile || !fileName || !fileType)return;
    //TODO: fix this for shared paths to take after the last / or \
    var fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf(".")); //fileName.replace(/.*[\/\\]([^\/\\]+)\..*/i,"$1");
    //文章的出版状态(默认是正式出版)
    var pubstatus = formFields ? formFields.pubStatus : "normal";
    formFields = _.isEmpty(formFields) ? {} : formFields;
    var logId = UploadLog.insert({
        name: fileName,
        pubStatus: pubstatus,
        creator: formFields.creator,
        publisherId: formFields.publisherId,
        uploadedAt: new Date(),
        status: "Started",
        filePath: pathToFile,
        filename: fileNameWithoutExtension,
        errors: []
    });
    if (Tasks.inProgress(undefined, logId, fileNameWithoutExtension)) {
        return;
    }

    if (fileType === "text/xml") {
        Tasks.parse(logId, pathToFile);
        return;
    }

    if (fileName.endWith(".zip")) {
        //extract to a folder with the same name inside extracted folder
        var targetPath = Config.tempFiles.uploadXmlDir.uploadDir + "/extracted/" + fileNameWithoutExtension;
        Tasks.extract(logId, pathToFile, targetPath);
        return;
    }
    Tasks.failSimple(undefined, logId, "Filetype is not suitable: " + fileType);
};

Tasks.fail = function (taskId, logId, errors) {
    if (taskId)
        UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
    UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: errors}});

    var log = UploadLog.findOne({_id: logId});
    if (log.extractTo)
        ScienceXML.RemoveFile(log.extractTo);
}

Tasks.failSimple = function (taskId, logId, errorMessage) {
    var e = [];
    e = _.union(e, errorMessage);
    Tasks.fail(taskId, logId, e);
}

Tasks.hasExistingArticleByFullDoi = function (taskId, logId, doi) {
    var existingArticle = Articles.findOne({doi: doi});
    if (!existingArticle)return false;
    Tasks.failSimple(taskId, logId, "Article found matching this DOI: " + doi);
    return true;
}

Tasks.hasExistingArticleByArticleDoi = function (taskId, logId, articledoi) {
    var existingArticle = Articles.findOne({articledoi: articledoi});
    if (!existingArticle)return false;
    Tasks.failSimple(taskId, logId, "Article found matching this article DOI: " + articledoi);
    return true;
}

Tasks.inProgress = function (taskId, logId, filename) {
    var existingLog = UploadLog.findOne({_id: logId});
    if (existingLog) {
        if (existingLog.status !== 'Pending') {
            //set to in progress(pending)
            UploadLog.update({_id: logId}, {$set: {status: "Pending"}});
            return false;
        }
        Tasks.failSimple(taskId, logId, "Import in progress matching this filename: " + filename);
    }
    return true;
}

Tasks.extract = function (logId, pathToFile, targetPath) {
    var taskId = UploadTasks.insert({
        action: "Extract",
        started: new Date(),
        status: "Started",
        logId: logId
    });

    extractZip(pathToFile, targetPath, true,
        Meteor.bindEnvironment(
            function (error) {
                if (error) {
                    logger.error("Error extracting ZIP file: " + error);//report error
                    return;
                }
                //set extract task to success, cleanup and start next task
                UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
                //get target xml filename TODO: make this better
                Science.FSE.readdir(targetPath,
                    Meteor.bindEnvironment(
                        function (err, file) {
                            if (err) {
                                logger.error(err);
                                return;
                            }
                            var xmlFileName = "";
                            var pdfFileName = "";
                            file.forEach(function (f) {
                                if (f.endWith('.xml') && f !== "readme.xml") {
                                    xmlFileName = f.substr(0, f.lastIndexOf(".xml"));
                                    //TODO: should break here, or better yet find a better means of finding the xml
                                }else if(f.endWith('.pdf')){
                                    pdfFileName = f.substr(0, f.lastIndexOf(".pdf"));
                                }
                            });
                            if (!xmlFileName) {
                                Tasks.failSimple(taskId, logId, "xml not found inside root of zip file");
                                return;
                            }

                            var targetXml = xmlFileName && targetPath + "/" + xmlFileName + ".xml";
                            var targetPdf = pdfFileName && targetPath + "/" + pdfFileName + ".pdf";//pdf默认位置，若xml内容中有指定pdf则以xml中的位置优先
                            UploadLog.update({_id: logId}, {
                                $set: {
                                    xml: targetXml,
                                    pdf: targetPdf,
                                    extractTo: targetPath
                                }
                            });
                            Tasks.parse(logId, targetXml);

                        }));
            }));
};

Tasks.parse = function (logId, pathToXml) {
    var log = UploadLog.findOne({_id: logId});
    var taskId = UploadTasks.insert({
        action: "Parse",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    try {
        var result;
        if (log.pubStatus == "accepted")
            result = Science.parserAccepted(pathToXml)
        else
            result = ScienceXML.parseXml(pathToXml, log);
        log.errors = result.errors;
        if (!_.isEmpty(log.errors)) {
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        if (log.creator != 'api' && !Tasks.checkPermission(result.journalId, log.creator)) {
            log.errors.push("Upload article permission denied");
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        if (!Tasks.checkPubStatus(result.doi, log.pubStatus)) {
            log.errors.push("Already exist more close to the final version of the data, can not override");
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        //set parse task to success and start next task
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

        //start import tasks
        Tasks.insertArticlePdf(logId, result);
    } catch (e) {
        if(!e)log.errors.push("unknown error occurred during import");
        else log.errors.push("Unexpected input was found during xml parsing: "+e.stack.toString());
        Tasks.fail(taskId, logId, log.errors);
    }
};

Tasks.checkPermission = function (journalId, userId) {
    return Permissions.userCan('add-article', 'resource', userId, {journal: journalId});
};

Tasks.checkPubStatus = function (doi, currStatus) {
    var statusOrder = {"normal": 0, "online_first": 1, "accepted": 2};

    if (statusOrder[currStatus] === undefined)
        return false;

    var articleObj = Articles.findOne({doi: doi}, {fields: {pubStatus: 1}});
    if (!articleObj || !articleObj.pubStatus)
        return true;

    return statusOrder[currStatus] <= statusOrder[articleObj.pubStatus]

};

Tasks.insertArticlePdf = function (logId, result) {
    var log = UploadLog.findOne({_id: logId});
    if (!ScienceXML.FileExists(log.pdf)) {
        logger.info("pdf not found in archive: " + log.name);
        Tasks.insertArticleImages(logId, result);
        return;
    }
    var taskId = UploadTasks.insert({
        action: "Insert PDF",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    //TODO: instead of inserting to collectionfs copy to original pdf folder in app

    //TODO: check destination path exists
    //TODO: copy file and get new path
    var newPdfFolder = Config.staticFiles.uploadPdfDir + "/" + result.issn;
    var newPdfPath = newPdfFolder + "/" + logId + ".pdf";
    ScienceXML.FolderExists(newPdfFolder);
    if (!ScienceXML.CopyFile(log.pdf, newPdfPath)) {
        logger.error("pdf failed to copy to: " + newPdfPath, err.message);
        Tasks.fail(taskId, logId, log.errors);
        return;
    }
    //TODO: write new path to article object
    result.pdfId = newPdfPath;
    //TODO: call insert
    UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
    UploadLog.update({_id: logId}, {$set: {pdfId: result.pdfId}});
    Tasks.insertArticleImages(logId, result);

    if (!_.isEmpty(log.errors)) {
        Tasks.fail(taskId, logId, log.errors);
        return;
    }
}
var readyToStartArticleImport = function (log, logId, taskId, result) {
    UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
    Tasks.insertArticleTask(logId, result);
    // if (log.extractTo)
    //     Meteor.setTimeout(function () {
    //         ScienceXML.RemoveFile(log.extractTo);
    //     }, 20000)
}
Tasks.insertArticleImages = function (logId, result) {
    var taskId = UploadTasks.insert({
        action: "Insert Images",
        started: new Date(),
        status: "Started",
        logId: logId
    });

    var log = UploadLog.findOne({_id: logId});
    var appendixFigures = result.appendix?result.appendix.figures:null;
    var unionFigures = _.compact(_.union(result.figures,appendixFigures));
    var finishCount=0;
    if (_.isEmpty(unionFigures)) {
        readyToStartArticleImport(log, logId, taskId, result);
    } else {
        unionFigures.forEach(function (fig) {
            var onlineOne = _.findWhere(fig.graphics, {use: "online"});
            // 兼容中国科学数据
            onlineOne = onlineOne || _.find(fig.graphics, function (g) {
                    return !g.use;
                });
            if (!onlineOne) {
                if (_.last(unionFigures) === fig) {
                    readyToStartArticleImport(log, logId, taskId, result)
                }
            } else {
                var figName = onlineOne.href;
                var figLocation = log.extractTo + "/" + figName;
                if (!ScienceXML.FileExists(figLocation)) {
                    logger.warn("image missing from import: " + log.name, figName);
                    log.errors.push("image missing: " + figName);
                }
                else if (!ScienceXML.IsImageTypeSupported(figLocation)) {
                    log.errors.push("image type not supported: " + figName);
                }
                else {
                    Science.ThumbUtils.TaskManager.add("figures",figLocation);
                    FiguresStore.insert(figLocation, function (err, fileObj) {
                        finishCount++;
                        if (err) {
                            logger.error(err);
                            log.errors.push(err.toString());
                        }
                        else {
                            fig.imageId = fileObj._id;
                            if (unionFigures.length === finishCount) {
                                readyToStartArticleImport(log, logId, taskId, result);
                            }
                        }
                    });
                }
            }
        });
    }
    //Don't insert the article if any images fail to import
    if (!_.isEmpty(log.errors)) {
        Tasks.fail(taskId, logId, log.errors);
        return;
    }
}


Tasks.insertArticleTask = function (logId, result) {
    var taskId = UploadTasks.insert({
        action: "Insert",
        started: new Date(),
        status: "Started",
        logId: logId
    });

    var hadError = false;
    var articleId;

    var log = UploadLog.findOne({_id: logId});
    result.pubStatus = log.pubStatus;//设置文章的出版状态和上传时选择的出版状态一致。

    try {
        articleId = insertArticle(result);
        if (articleId) {
            insertKeywords(result.keywords);
        }
        //Meteor.setTimeout(function(){
        //    Science.ThumbUtils.addCreateThumbTasks(_.pluck(result.figures,"imageId"));
        //},2000);

    }
    catch (ex) {
        Tasks.failSimple(taskId, logId, _.union(result.errors, ex.message));
        hadError = true;
    }
    if (!hadError) {
        var url = Science.URL.articleDetail(articleId);
        logger.info("Import complete: " + log.name + " available at " + url);

        UploadTasks.update(
            {_id: taskId},
            {$set: {status: "Success"}});
        UploadLog.update(
            {_id: logId},
            {$set: {status: "Success", articleId: articleId, articleUrl: url}}
        );
        if(Meteor.isLive){
            Science.Interface.CrossRef.registerOne(result.doi);
        }
    }
}
var insertKeywords = function (a) {
    if (!a)return;
    if (a.cn) {
        a.cn.forEach(function (name) {
            if (!Keywords.findOne({name: name})) {
                Keywords.insert({
                    lang: "cn",
                    name: name,
                    score: 0
                });
            }
        })
    }
    if (a.en) {
        a.en.forEach(function (name) {
            if (!Keywords.findOne({name: name})) {
                Keywords.insert({
                    lang: "en",
                    name: name,
                    score: 0
                });
            }
        })
    }
}

var insertArticle = function (a) {
    var journal = Publications.findOne({_id: a.journalId});
    if (!journal) {
        logger.error("Parser should have failed if journal was missing but somehow it didn't.");
        return;
    } //should never happen.

    a.accessKey = journal.accessKey;
    a.language = journal.language;

    if (a.pubStatus == 'normal' || a.pubStatus == 'online_first') {
        //确保article有一个关联的issue
        var vi = ScienceXML.IssueCreatorInstance.createIssue({
            journalId: a.journalId,
            volume: a.volume,
            issue:a.issue,
            year:a.year
        })

        if(!vi && a.pubStatus == 'normal'){
            throw new Error("already published data must have volume and issue")
        }
        a.volumeId=vi?vi.volumeId:null;
        a.issueId=vi?vi.issueId:null;
    }


    //将PACS代号转换为PACS名称.
    if (!_.isEmpty(a.pacs)) {
        var matchs = pacs.find({pacsCode: {$in: a.pacs}}).fetch();
        a.pacs = matchs;
    }

    var journalInfo = Publications.findOne({_id: a.journalId}, {
        fields: {
            title: 1,
            titleCn: 1,
            issn: 1,
            EISSN: 1,
            CN: 1
        }
    });
    a.journal = journalInfo;

    if(!_.isEmpty(a.authors)){
        var orderAuthors={cn:"",en:""};
        _.each(a.authors,function(author){
            if(!_.isEmpty(author.fullname)){
                if(_.isString(author.fullname.cn) && author.fullname.cn.trim())
                    orderAuthors.cn+=author.fullname.cn.trim()+"|";
                if(_.isString(author.fullname.en) && author.fullname.en.trim())
                    orderAuthors.en+=author.fullname.en.trim()+"|";
            }
        })
        a.orderAuthors=orderAuthors;
    }
    //设置padPage
    var atcpage= a.elocationId || a.startPage || "";
    a.padPage = a.journal.issn+Science.String.PadLeft(a.volume || "novolume","0",8)+Science.String.PadLeft(a.issue || "noissue","0",8)+Science.String.PadLeft(atcpage,"0",10);

    //若DOI已存在于数据库中，则更新配置文件中设置的指定字段内容。
    var existArticle = Articles.findOne({doi: a.doi});
    if (existArticle) {
        var sets={};
        _.each(Config.fieldsFromXmlToUpdate,function(key){
            sets[key]=a[key];
        })
        Articles.update({_id: existArticle._id}, {$set: sets});

        //创建期刊专题
        if(a.issueId&&a.special&& _.contains(journal.tabSelections,"Special Topics")){
            var qureyArr = [];
            qureyArr.push({'title.en': a.special});
            qureyArr.push({'title.cn': a.special});
            var symposium = SpecialTopics.findOne({$or: qureyArr});
            if(symposium && symposium.journalId===a.journalId) {
                var newArr = _.union(symposium.articles, existArticle._id);
                SpecialTopics.update({_id: symposium._id}, {$set: {articles: newArr}});
            }else{
                var specialId = SpecialTopics.insert({
                    title: {cn: a.special, en: a.special},
                    journalId:a.journalId,
                    IssueId:a.issueId,
                    createDate:new Date()
                });
                SpecialTopics.update({_id: specialId}, {$set: {articles: [existArticle._id]}});
            }
        }

        return existArticle._id;
    }

    //如果以后这里增加了新的字段，不要忘记更新Config中的fieldsFromXmlToUpdate
    var id = Articles.insert({
        doi: a.doi,
        articledoi: a.articledoi,
        title: a.title,
        abstract: a.abstract,
        journalId: a.journalId,
        journal: a.journal,//journal是后加的
        publisher: a.publisher,
        elocationId: a.elocationId,
        startPage: a.startPage,
        endPage: a.endPage,
        padPage: a.padPage,
        year: a.year,
        month: a.month,
        issue: a.issue,
        volume: a.volume,
        issueId: a.issueId,
        volumeId: a.volumeId,
        received: a.received,
        accepted: a.accepted,
        published: a.published,
        topic: a.topic,
        contentType: a.contentType,
        acknowledgements: a.acknowledgements,//致谢信息
        pdfId: a.pdfId,
        authors: a.authors,
        authorNotes: a.authorNotes,
        affiliations: a.affiliations,
        sections: a.sections,
        figures: a.figures,
        tables: a.tables,
        keywords: a.keywords,
        references: a.references,
        pubStatus: a.pubStatus, //出版状态
        accessKey: a.accessKey,
        language: a.language,
        pacs: a.pacs,
        fundings: a.fundings,
        special: a.special, //专题名 (该专题名仅从xml数据中取得,与系统功能中的专题无关)
        orderAuthors: a.orderAuthors,
        appendix: a.appendix,
        openAccess: a.openAccess, //开放获取
        interest: a.interest, //利益冲突声明
        contributions: a.contributions //作者贡献声明
    });

    //创建期刊专题
    if(a.issueId&&a.special&& _.contains(journal.tabSelections,"Special Topics")){
        var qureyArr = [];
        qureyArr.push({'title.en': a.special});
        qureyArr.push({'title.cn': a.special});
        var symposium = SpecialTopics.findOne({$or: qureyArr});
        if(symposium && symposium.journalId===a.journalId) {
            var newArr = _.union(symposium.articles, id);
            SpecialTopics.update({_id: symposium._id}, {$set: {articles: newArr}});
        }else{
            var specialId = SpecialTopics.insert({
                title: {cn: a.special, en: a.special},
                journalId:a.journalId,
                IssueId:a.issueId,
                createDate:new Date()
            });
            SpecialTopics.update({_id: specialId}, {$set: {articles: [id]}});
        }
    }

    return id;
};