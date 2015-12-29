Template.AdminUpload.helpers({
    uploadHistory: function () {
        if(Router.current().route.getName() == "publisher.upload") {
            if(!Meteor.user().publisherId) return;
            return UploadLog.find(
                {$or: [
                    {publisherId: Meteor.user().publisherId},
                    {creator: Meteor.userId()}
                ]
                }, {sort: {'uploadedAt': -1}}
            );
        }
        else return UploadLog.find({}, {sort: {'uploadedAt': -1}});
    }
});
Template.UploadLogModal.helpers({
    uploadTasks: function () {
        var logId = Session.get('uploadLogId');
        if (logId)
            return UploadTasks.find({logId: logId}, {sort: {'started': 1}});
    },
    errors: function () {
        var logId = Session.get('uploadLogId');
        if (logId)
            return UploadLog.findOne({_id: logId}).errors;
    },
    importSucceeded: function () {
        var logId = Session.get('uploadLogId');
        var log = UploadLog.findOne({_id: logId});
        if (!log)return false;
        if (log.articleId)return true;
    }
});

Template.UploadLogModal.events({
    "click .goToArticle": function (e) {
        $('#uploadLogModal').modal('hide');
        var logId = Session.get('uploadLogId');
        var log = UploadLog.findOne({_id: logId});
        if (!log)return false;
        Router.go(log.articleUrl);
    }
});

Template.uploadTableRow.events({
    "click .task-detail": function (e) {
        Session.set('uploadLogId', this._id);
    }
});