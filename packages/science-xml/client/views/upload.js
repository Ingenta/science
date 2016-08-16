Template.AdminUpload.helpers({
    uploadHistory: function () {
        var numPerPage = Session.get('PerPage') || 10;
        if(Session.get('searchValue')){
            var name = Session.get('searchValue');
            var mongoDbArr = [];
            mongoDbArr.push({'name': {$regex: name, $options: "i"}});
             return uploadLogPagination.find({$or: mongoDbArr},{itemsPerPage: numPerPage});
        }
        if(Router.current().route.getName() == "publisher.upload") {
            if(!Meteor.user().publisherId) return;
            return uploadLogPagination.find(
                {$or: [
                    {publisherId: Meteor.user().publisherId},
                    {creator: Meteor.userId()}
                ]
                }, {itemsPerPage: numPerPage, sort: {'uploadedAt': -1}}
            );
        }
        else return uploadLogPagination.find({}, {itemsPerPage: numPerPage, sort: {'uploadedAt': -1}});
    },
    uploadHistoryCount: function(){
        var name = Session.get('searchValue');
        var mongoDbArr = [];
            mongoDbArr.push({'name': {$regex: name, $options: "i"}});
        if(name)return UploadLog.find({$or: mongoDbArr}).count()>10;
        return UploadLog.find().count()>10;
    }
});

Template.AdminUpload.events({
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
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
