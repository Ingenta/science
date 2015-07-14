Tasks = {};

Tasks.fail = function (taskId, logId, errors) {
    if(taskId)
        UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
    UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: errors}});

    var log = UploadLog.findOne({_id: logId});
    ScienceXML.RemoveFile(log.filePath);
    if (log.extractTo)
        ScienceXML.RemoveFile(log.extractTo);
}

Tasks.extractTaskStart = function (logId, pathToFile, targetPath) {
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
                            var doi = "";
                            file.forEach(function (f) {
                                if (f.endWith('.xml') && f !== "readme.xml") {
                                    doi = f.substr(0, f.lastIndexOf(".xml"));
                                }
                            });
                            if (!doi) {
                                var e = [];
                                e.push("xml not found inside zip file");
                                Tasks.fail(taskId, logId, e);
                                return;
                            }

                            var targetXml = targetPath + "/" + doi + ".xml";
                            var targetPdf = targetPath + "/" + doi + ".pdf";
                            UploadLog.update({_id: logId}, {
                                $set: {
                                    xml: targetXml,
                                    pdf: targetPdf,
                                    extractTo: targetPath
                                }
                            });
                            Tasks.parseTaskStart(logId, targetXml);

                        }));
            }));
}

Tasks.parseTaskStart = function (logId, pathToXml) {
    var log = UploadLog.findOne({_id: logId});
    var taskId = UploadTasks.insert({
        action: "Parse",
        started: new Date(),
        status: "Started",
        logId: logId
    });
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
        //set parse task to success and start next task
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

        //start import pdf task
        Tasks.insertArticlePdf(logId, result);


    });
}


Tasks.insertArticlePdf = function (logId, result) {
    //insert into images collection

    var log = UploadLog.findOne({_id: logId});
    if (!ScienceXML.FileExists(log.pdf)) {
        console.log("pdf missing");
        Tasks.insertArticleTask(logId, result);
        return;
    }
    var taskId = UploadTasks.insert({
        action: "InsertPdf",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    ArticleXml.insert(log.pdf, function (err, fileObj) {
        result.pdfId = fileObj._id;
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
        UploadLog.update({_id: logId}, {$set: {pdfId: fileObj._id}});
        Tasks.insertArticleTask(logId, result);
    });
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
    try {
        articleId = insertArticle(result);
    }
    catch (ex) {
        var e = [];
        e.push(ex.message);
        Tasks.fail(taskId, logId, e);
        hadError = true;
    }
    if (!hadError) {
        //cleanup and set log and tasks to done
        var log = UploadLog.findOne({_id: logId});
        ScienceXML.RemoveFile(log.filePath);
        if (log.extractTo)
            ScienceXML.RemoveFile(log.extractTo);
        UploadTasks.update(
            {_id: taskId},
            {$set: {status: "Success"}});
        UploadLog.update(
            {_id: logId},
            {$set: {status: "Success", articleId: articleId}}
        );
    }
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
        title: a.title,
        authors: a.authors,
        abstract: a.abstract,
        journalId: a.journalId,
        publisher: a.publisher,
        references: a.references,
        affiliations: a.affiliations,
        elocationId: a.elocationId,
        authorNotes: a.authorNotes,
        year: a.year,
        month: a.month,
        issue: a.issue,
        volume: a.volume,
        issueId: a.issueId,
        volumeId: a.volumeId,
        sections: a.sections,
        received: a.received,
        accepted: a.accepted,
        published: a.published,
        topic: a.topic,
        figures: a.figures,
        tables: a.tables,
        pdfId: a.pdfId
    });
    return id;
}