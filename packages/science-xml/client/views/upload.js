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
    "click .task-detail": function (e) {
        Session.set('uploadLogId', this._id);
    }
});


