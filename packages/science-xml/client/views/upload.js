Template.uploadForm.events({
    'change .myFileInput': function (event, template) {
        FS.Utility.eachFile(event, function (file) {
            var errors = [];
            var status;
            if (file.type === "text/xml") {
                status = "Pending";
            } else {
                status = "Failed";
                errors.push("File type mismatch!")
            }
            var fileId;
            //upload
            ArticleXml.insert(file, function (err, fileObj) {
                fileId = fileObj._id;
                var logId = UploadLog.insert({
                    fileId: fileObj._id,
                    name: fileObj.name(),
                    uploadedAt: new Date(),
                    errors: errors,
                    status: status
                });
                //parse
                UploadTasks.insert({
                    action: "Parse",
                    started: new Date(),
                    status: "Started",
                    logId: logId
                });
                //logId && importXmlByLogId(logId);
            });
        });
    }
});

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find({}, {sort: {'uploadedAt': -1}});
    }
});
Template.UploadLogModal.helpers({
    uploadTasks: function () {
        var logId = Session.get('uploadLogId')
        return UploadTasks.find({logId: logId}, {sort: {'started': -1}});
    },
    errors: function () {
        return Session.get("errors");
    }
});

Template.uploadTableRow.events({
    "click .btn": function (e) {
        Session.set('errors', undefined);
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes
        Session.set('uploadLogId', uploadLogId);
        importXmlByLogId(uploadLogId);
    }
});

var importXmlByLogId = function (logId) {
    //get failed state
    var log = UploadLog.findOne({_id: logId});
    if(log.status==="Success")return;
    var path = ArticleXml.findOne({_id: log.fileId}).url();
    var thisTask = UploadTasks.findOne({action: "Parse", logId: logId});
    //call parse and put results in session
    Meteor.call('parseXml', path, function (error, result) {
        if (error) {
            //console.log(error);
            log.errors.push(error);
            Session.set('errors', log.errors);
            Session.set("result", undefined);
            UploadLog.update({_id: logId}, {$set: {status: "Failed"}});
            if (thisTask) UploadTasks.update({_id: thisTask._id}, {$set: {status: "Failed"}});
        }
        else {
            //add article object to session
            if (result.errors)
                log.errors = result.errors;
            Session.set('errors', log.errors);
            Session.set("result", result);
            if (log.errors.length) {
                UploadLog.update({_id: logId}, {$set: {status: "Failed"}});
                if (thisTask) UploadTasks.update({_id: thisTask._id}, {$set: {status: "Failed"}});
                return;
            }

            if (thisTask) UploadTasks.update({_id: thisTask._id}, {$set: {status: "Success"}});

            //ARTICLE INSERT
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


            UploadLog.update(
                {_id: logId},
                {$set: {status: "Success"}}
            );
        }
    });
}


