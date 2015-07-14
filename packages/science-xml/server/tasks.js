Tasks = {};
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
                    return;
                }
                UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
                FSE.readdir(targetPath,
                    Meteor.bindEnvironment(
                        function (err, file) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            file.forEach(function (f) {
                                if (f.endWith('.xml') && f !== "readme.xml") {
                                    var targetXml = targetPath + "/" + f;
                                    Tasks.parseTaskStart(logId, targetXml);
                                }
                            });
                        }));
            }));
}

Tasks.parseTaskStart = function (logId, pathToXml) {

    //get failed state
    var log = UploadLog.findOne({_id: logId});
    if (log.status === "Success")return;
    var taskId = UploadTasks.insert({
        action: "Parse",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    //call parse and put results in session
    Meteor.call('parseXml', pathToXml, function (error, result) {
        if (error) {
            if (log.errors === undefined)log.errors = [];
            log.errors.push(error.toString());
            UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: log.errors}});
            UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
        }
        else {
            if (result.errors) {
                log.errors = result.errors;
                if (log.errors.length) {
                    UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: log.errors}});
                    UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
                    return;
                }
                //set parse task to success
                UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});

                Tasks.insertArticleTask(logId, result);
            }
        }
    });
}

Tasks.insertArticleTask = function (logId, result) {
    //ARTICLE INSERT
    var taskId = UploadTasks.insert({
        action: "Insert",
        started: new Date(),
        status: "Started",
        logId: logId
    });
    var hadError = false;
    try {
        var volume = Volumes.findOne({journalId: result.journalId, volume: result.volume});
        if (!volume) {
            volume = Volumes.insert({journalId: result.journalId, volume: result.volume});
        }
        result.volumeId = volume._id || volume;

        var issue = Issues.findOne({journalId: result.journalId, volume: result.volume, issue: result.issue});
        if (!issue) {
            issue = Issues.insert({
                journalId: result.journalId,
                volume: result.volume,
                issue: result.issue,
                year: result.year,
                month: result.month
            });
        }
        //确保article有一个关联的issue
        result.issueId = issue._id || issue;

        Articles.insert({
            doi: result.doi,
            title: result.title,
            authors: result.authors,
            abstract: result.abstract,
            journalId: result.journalId,
            publisher: result.publisher,
            references: result.references,
            affiliations: result.affiliations,
            elocationId: result.elocationId,
            authorNotes: result.authorNotes,
            year: result.year,
            month: result.month,
            issue: result.issue,
            volume: result.volume,
            issueId: result.issueId,
            volumeId: result.volumeId,
            sections: result.sections,
            received: result.received,
            accepted: result.accepted,
            published: result.published,
            topic: result.topic,
            figures: result.figures,
            tables: result.tables
        });


    }
    catch (ex) {
        var e = [];
        e.push(ex.message);
        UploadLog.update({_id: logId}, {$set: {status: "Failed", errors: e}});
        UploadTasks.update({_id: taskId}, {$set: {status: "Failed"}});
        hadError = true;
    }
    if (!hadError) {
        UploadTasks.update({_id: taskId}, {$set: {status: "Success"}});
        UploadLog.update(
            {_id: logId},
            {$set: {status: "Success"}}
        );
    }
}