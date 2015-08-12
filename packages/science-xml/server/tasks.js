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
    if (Tasks.hasExistingArticleByArticleDoi(undefined, logId, fileNameWithoutExtension)) {
        return;
    }


    if (fileType === "text/xml") {
        Tasks.parse(logId, pathToFile);
        return;
    }

    if (fileType === "application/zip") {
        //extract to a folder with the same name inside extracted folder
        var targetPath = Config.uploadXmlDir.uploadDir + "/extracted/" + fileNameWithoutExtension;
        Tasks.extract(logId, pathToFile, targetPath);
        return;
    }
    Tasks.failSimple(taskId, logId, "File is not suitable");
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
    e.push(errorMessage);
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
    var existingLog = UploadLog.findOne({filename: filename, status: "Pending"});
    if (!existingLog) {
        //set to in progress(pending)
        UploadLog.update({_id: logId}, {$set: {status: "Pending"}});
        return false;
    }
    Tasks.failSimple(taskId, logId, "Import in progress matching this filename: " + filename);
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
                    console.log("Error extracting ZIP file: " + error);//report error
                    //THIS DOESNT REALLY WORK
                    //TODO: test this condition
                    return;
                }
                //set extract task to success, cleanup and start next task
                UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
                //get target xml filename TODO: make this better
                FSE.readdir(targetPath,
                    Meteor.bindEnvironment(
                        function (err, file) {
                            if (err) {
                                console.log(err);
                                //TODO: test this condition
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
                                Tasks.failSimple(taskId, logId, "xml not found inside zip file");
                                return;
                            }

                            var log = UploadLog.findOne({_id: logId});
                            if (log.filename !== xmlFileName) {
                                Tasks.failSimple(taskId, logId, "xml file found inside zip does not match filename doi");
                                return;
                            }
                            var targetXml = targetPath + "/" + xmlFileName + ".xml";
                            var targetPdf = targetPath + "/" + xmlFileName + ".pdf";
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
    //TODO: refactor this after solving, unhandled error, [TypeError: Cannot read property 'localNSMap' of undefined]
    Meteor.call('parseXml', pathToXml, function (error, result) {
        if (error) {
            log.errors.push(error.toString());
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        log.errors = result.errors;
        if (log.errors.length) {
            Tasks.fail(taskId, logId, log.errors);
            return;
        }
        //DOI in xml doesn't match filename
        if (result.articledoi !== log.filename) {
            Tasks.failSimple(taskId, logId, "doi in article xml does not match filename");
            return;
        }
        //set parse task to success and start next task
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

        //start import tasks
        Tasks.insertArticlePdf(logId, result);
    });
}


Tasks.insertArticlePdf = function (logId, result) {
    var log = UploadLog.findOne({_id: logId});
    if (!ScienceXML.FileExists(log.pdf)) {
        console.log("pdf missing");
        Tasks.insertArticleImages(logId, result);
        return;
    }
    var taskId = UploadTasks.insert({
        action: "Insert PDF",
        started: new Date(),
        status: "Started",
        logId: logId
    });

    ArticleXml.insert(log.pdf, function (err, fileObj) {
        result.pdfId = fileObj._id;
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
        UploadLog.update({_id: logId}, {$set: {pdfId: fileObj._id}});
        Tasks.insertArticleImages(logId, result);
    });
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
        if (log.extractTo)Meteor.setTimeout(ScienceXML.RemoveFile(log.extractTo), 20000);
    }
    else {
        result.figures.forEach(function (fig) {
            var figName = _.findWhere(fig.graphics, {use: "online"}).href;
            var figLocation = log.extractTo + "/" + figName;
            if (!ScienceXML.FileExists(figLocation)) {
                console.log("image missing: " + figName);
            }
            else {
                ArticleXml.insert(figLocation, function (err, fileObj) {
                    fig.imageId = fileObj._id;
                    UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
                    if (_.last(result.figures) === fig) {
                        Meteor.setTimeout(ScienceXML.RemoveFile(log.extractTo), 20000)
                    }
                });
            }
        });
    }

    Tasks.insertArticleTask(logId, result);
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
        inertKeywords(result.keywords);
        articleId = insertArticle(result);
    }
    catch (ex) {
        Tasks.failSimple(taskId, logId, ex.message);
        hadError = true;
    }
    if (!hadError) {
        //cleanup and set log and tasks to done
        ScienceXML.RemoveFile(log.filePath);
        UploadTasks.update(
            {_id: taskId},
            {$set: {status: "Success"}});
        UploadLog.update(
            {_id: logId},
            {$set: {status: "Success", articleId: articleId}}
        );
    }
}
var inertKeywords = function (a) {
    a.forEach(function (name) {
        if (!Keywords.findOne({name: name})) {
            Keywords.insert({
                name: name,
                score: 0
            });
        }
    })
}

var insertArticle = function (a) {
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
            month: a.month
        });
    }
    //确保article有一个关联的issue
    a.issueId = issue._id || issue;

    var id = Articles.insert({
        doi: a.doi,
        articledoi: a.articledoi,
        title: a.title,
        abstract: a.abstract,
        journalId: a.journalId,
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
        pubStatus: a.pubStatus //出版状态
    });
    return id;
}