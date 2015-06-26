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
            ArticleXml.insert(file, function (err, fileObj) {
                fileId = fileObj._id;
                UploadLog.insert({
                    fileId: fileObj._id,
                    name: fileObj.name(),
                    uploadedAt: new Date(),
                    errors: errors,
                    status: status
                });
            });

            //TODO: need to wait here for upload to finish to get fileid so we can get the path to parse
        });
    }
});

Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find({},{sort: {'uploadedAt': -1}});
    }
});
Template.UploadLogModal.helpers({
    results: function () {
        return Session.get("result");
    },
    errors: function () {
        return Session.get("errors");
    }
});
Template.uploadTableRow.events({
    "click .btn": function (e) {
        //get this item in the table
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes

        importXmlByLogId(uploadLogId);
    }
});

var importXmlByLogId = function (logId) {

    //get failed state
    var log = UploadLog.findOne({_id: logId});
    if (log.errors.length) { //if file is not xml guard then return
        Session.set('errors', log.errors);
        Session.set("result", undefined);
        return;
    }

    var id = log.fileId;
    var path = ArticleXml.findOne({_id: id}).url();
    //call parse and put results in session
    Meteor.call('parseXml', path, function (error, result) {
        if (error) {
            //console.log(error);
            log.errors.push(error);
            Session.set('errors', log.errors);
            Session.set("result", undefined);
            UploadLog.update({_id: logId}, {$set: {status: "Failed"}});
        } else {
            //add article object to session
            if (result.errors)
                log.errors = result.errors;
            Session.set('errors', log.errors);
            Session.set("result", result);
            if (log.errors.length) {
                UploadLog.update({_id: logId}, {$set: {status: "Failed"}});
                return;
            }

            var volume = Volumes.findOne({journalId: result.journalId, volume: result.volume});
            if (!volume) {
                volume = Volumes.insert({journalId: result.journalId, volume: result.volume});
            }
            result.volumeId = volume.id || volume;

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
            result.issueId = issue.id || issue;

            Articles.insert({
                doi: result.doi,
                title: result.title,
                authors:result.authors,
                abstract: result.abstract,
                journalId:result.journalId,
                publisher:result.publisher,
                references:result.references,
                affiliations: result.affiliations,
                elocationId: result.elocationId,
                authorNotes: result.authorNotes,
                year: result.year,
                month: result.month,
                issue: result.issue,
                volume: result.volume,
                issueId: result.issueId,
                volumeId: result.volumeId,
                body: result.body
            });


            UploadLog.update(
                {_id: logId},
                {$set: {status: "Success"}}
            );
        }
    });
}


