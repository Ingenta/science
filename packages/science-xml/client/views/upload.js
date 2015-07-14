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
        var logId = Session.get('uploadLogId')
        return UploadLog.findOne({_id: logId}).errors;
    }
});

Template.uploadTableRow.events({
    "click .btn": function (e) {
        Session.set('errors', undefined);
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes
        Session.set('uploadLogId', uploadLogId);
        //importXmlByLogId(uploadLogId);
    }
});


