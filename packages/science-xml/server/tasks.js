Tasks = {};

Tasks.startJob = function (pathToFile, fileName, fileType, formFields) {
    if (!pathToFile || !fileName || !fileType)return;
    var fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf("."));
    //文章的出版状态(默认是正式出版)
    var pubstatus = formFields ? formFields.pubStatus : "normal";

    var logId = UploadLog.insert({
        name: fileName,
        pubStatus: pubstatus,
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
    ScienceXML.RemoveFile(log.filePath);
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
                            file.forEach(function (f) {
                                if (f.endWith('.xml') && f !== "readme.xml") {
                                    xmlFileName = f.substr(0, f.lastIndexOf(".xml"));
                                    //TODO: should break here, or better yet find a better means of finding the xml
                                }
                            });
                            if (!xmlFileName) {
                                Tasks.failSimple(taskId, logId, "xml not found inside root of zip file");
                                return;
                            }

                            var targetXml = targetPath + "/" + xmlFileName + ".xml";
                            var targetPdf = targetPath + "/" + xmlFileName + ".pdf";//pdf默认位置，若xml内容中有指定pdf则以xml中的位置优先
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
}

Tasks.parse = function (logId, pathToXml) {
    var log = UploadLog.findOne({_id: logId});
    var taskId = UploadTasks.insert({
        action: "Parse",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    try {
        var result = ScienceXML.parseXml(pathToXml);
        log.errors = result.errors;
        if (!_.isEmpty(log.errors)) {
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        //set parse task to success and start next task
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

        //start import tasks
        Tasks.insertArticlePdf(logId, result);
    } catch (e) {
        log.errors.push(e.toString());
        Tasks.fail(taskId, logId, log.errors);
    }
}


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
    PdfStore.insert(log.pdf, function (err, fileObj) {
        result.pdfId = fileObj._id;
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
        UploadLog.update({_id: logId}, {$set: {pdfId: fileObj._id}});
        Tasks.insertArticleImages(logId, result);
    });
}
var readyToStartArticleImport = function (log, logId, taskId, result) {
    UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
    Tasks.insertArticleTask(logId, result);
    if (log.extractTo)
        Meteor.setTimeout(function () {
            ScienceXML.RemoveFile(log.extractTo);
        }, 20000)
}
Tasks.insertArticleImages = function (logId, result) {
    var taskId = UploadTasks.insert({
        action: "Insert Images",
        started: new Date(),
        status: "Started",
        logId: logId
    });

    var log = UploadLog.findOne({_id: logId});
    if (!result.figures) {
        readyToStartArticleImport(log, logId, taskId, result);
    }
    else {
        result.figures.forEach(function (fig) {
            var onlineOne = _.findWhere(fig.graphics, {use: "online"});
            // 兼容中国科学数据
            onlineOne = onlineOne || _.find(fig.graphics, function (g) {
                    return !g.use;
                });
            if (!onlineOne) {
                if (_.last(result.figures) === fig) {
                    readyToStartArticleImport(log, logId, taskId, result)
                }
            } else {
                var figName = onlineOne.href;
                var figLocation = log.extractTo + "/" + figName;
                if (!ScienceXML.FileExists(figLocation)) {
                    logger.warn("image missing from import: " + log.name, figName);
                    log.errors.push("image missing: " + figName);
                }
                else {
                    FiguresStore.insert(figLocation, function (err, fileObj) {
                        if (err) {
                            logger.error(err);
                            log.errors.push(err.toString());
                        }
                        else {
                            fig.imageId = fileObj._id;
                            if (_.last(result.figures) === fig) {
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
    }
    catch (ex) {
        Tasks.failSimple(taskId, logId, _.union(result.errors, ex.message));
        hadError = true;
    }
    if (!hadError) {
        var url = Science.URL.articleDetail(articleId);
        logger.info("Import complete: " + log.name + " available at " + url);
        //cleanup and set log and tasks to done
        ScienceXML.RemoveFile(log.filePath);
        UploadTasks.update(
            {_id: taskId},
            {$set: {status: "Success"}});
        UploadLog.update(
            {_id: logId},
            {$set: {status: "Success", articleId: articleId, articleUrl: url}}
        );
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

    var volume = Volumes.findOne({journalId: a.journalId, volume: a.volume});
    if (!volume) {
        volume = Volumes.insert({
            journalId: a.journalId,
            volume: a.volume
        });
    }
    a.volumeId = volume._id || volume;

    var issue = Issues.findOne({journalId: a.journalId, volume: a.volume, issue: a.issue});
    if (!issue) {
        issue = Issues.insert({
            journalId: a.journalId,
            volume: a.volume,
            issue: a.issue,
            year: a.year,
            month: a.month,
            createDate: new Date()
        });
    }
    //确保article有一个关联的issue
    a.issueId = issue._id || issue;

    //将PACS代号转换为PACS名称.
    if (!_.isEmpty(a.pacs)) {
        var matchs = pacs.find({pacsCode: {$in: a.pacs}}).fetch();
        a.pacs = matchs;
    }

    //若DOI已存在于数据库中，则更新配置文件中设置的指定字段内容。
    var existArticle = Articles.findOne({doi: a.doi});
    if (existArticle) {
        var sets = _.pick(a, Config.fieldsFromXmlToUpdate);
        Articles.update({_id: existArticle._id}, {$set: sets});
        return existArticle._id;
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
    a.journalInfo = journalInfo;


    //如果以后这里增加了新的字段，不要忘记更新Config中的fieldsWhichFromXml
    var id = Articles.insert({
        doi: a.doi,
        articledoi: a.articledoi,
        title: a.title,
        abstract: a.abstract,
        journalId: a.journalId,
        journal: a.journalInfo,//journal是后加的
        publisher: a.publisher,
        elocationId: a.elocationId,
        year: a.year,
        month: a.month,
        issue: a.issue,
        volume: a.volume,
        issueId: a.issueId,
        volumeId: a.volumeId,
        received: a.received,
        accepted: a.accepted,
        published: a.published,
        topic: [a.topic],
        contentType: a.contentType,
        acknowledgements: a.ack,
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
        fundings: a.fundings
    });
    return id;
};