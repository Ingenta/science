Template.AdminUpload.helpers({
    uploadHistory: function () {
        return UploadLog.find({}, {sort: {'uploadedAt': -1}});
    }
});
Template.UploadLogModal.helpers({
    uploadTasks: function () {
        var logId = Session.get('uploadLogId')
        return UploadTasks.find({logId: logId}, {sort: {'started': 1}});
    },
    errors: function () {
        var logId = Session.get('uploadLogId')
        return UploadLog.findOne({_id: logId}).errors;
    }
});

Template.uploadTableRow.events({
    "click .btn": function (e) {
        var button = $(e.target) // Button that triggered the modal
        var uploadLogId = button.data('logid') // Extract info from data-* attributes
        Session.set('uploadLogId', uploadLogId);
    }
});


