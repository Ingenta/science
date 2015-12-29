Template.AdminUpload.helpers({
    uploadHistory: function () {
        if(Session.get('searchValue')){
            var tagName = Session.get('searchValue');
            var mongoDbArr = [];
            mongoDbArr.push({'tagNumber': {$regex: tagName, $options: "i"}});
            mongoDbArr.push({'name': {$regex: tagName, $options: "i"}});
             return UploadLog.find({$or: mongoDbArr});
        }
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

Template.uploadForm.events({
    'click .btn': function () {
        var query = $('#searchValue').val();
        Session.set('searchValue', query);
    }
});
