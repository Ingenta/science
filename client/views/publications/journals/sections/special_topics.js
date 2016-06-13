Template.addSpecialTopicsForm.helpers({
    issue: function () {
        var id = Session.get("currentJournalId");
        var issue = Issues.find({journalId: id}).fetch();
        var result = [];
        if (TAPi18n.getLanguage() === "zh-CN") {
            _.each(issue, function (item) {
                result.push({
                    label: TAPi18n.__('Volume') + ": " + item.volume + "-" + TAPi18n.__('Issue') + ": " + item.issue,
                    value: item._id
                });
            });
        } else {
            _.each(issue, function (item) {
                result.push({
                    label: TAPi18n.__('Volume') + ": " + item.volume + "-" + TAPi18n.__('Issue') + ": " + item.issue,
                    value: item._id
                });
            });
        }
        return result;
    }
})

Template.SpecialTopics.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            SpecialTopics.remove({_id: id});
        })
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});

Template.SpecialTopics.helpers({
    specialTopics: function () {
        var numPerPage = Session.get('PerPage');
        if (numPerPage === undefined) {
            numPerPage = 10;
        }
        return mySpecialTopicsPagination.find({journalId:this._id},{itemsPerPage: numPerPage, sort: {order: -1}});
    },
    specialTopicsCount: function(){
        return SpecialTopics.find({journalId:this._id}).count()>10;
    },
    year: function () {
        var issue = Issues.findOne({_id: this.IssueId});
        if (issue)
            return issue.volume+"("+issue.issue+")"+", "+TAPi18n.__("Published")+":"+issue.year;
    },
    name: function () {
        var id = Session.get("specialTopicsId");
        var specialTopics = SpecialTopics.findOne({_id: id});
        return specialTopics.title;
    },
    permissionCheck: function (permissions) {
        if (!Meteor.user()) return false;
        if (Permissions.isAdmin()) return true;
        //if(Permissions.userCan(onePermission, 'collections')) return true;

        if (!Meteor.user().publisherId) return false;
        if (Meteor.user().publisherId !== Session.get('currentPublisherId')) return false;

        if (!_.contains(Permissions.getUserRoles(), "publisher:publisher-manager-from-user")) {
            if (!_.contains(Meteor.user().journalId, Session.get('currentJournalId'))) return false;
        }
        var flag = false;
        permissions.split(',').forEach(function (onePermission) {
            if (Permissions.userCan(onePermission, 'collections')) flag = true;
        });
        return flag;
    },
    getUrlToSpecialTopicManagement: function (specialTopicId) {
        var journalId = Session.get("currentJournalId");
        if (!journalId)return;
        var journalPart = getJournalComponentByJournalId(journalId);
        if (!journalPart)return;
        return journalPart + "/" + specialTopicId;
    },
    getData:function(){
        return _.extend({specialTopicsId:this._id},Router.current().params);
    }
})

AutoForm.addHooks(['addSpecialTopicsModalForm'], {
    before: {
        insert: function (doc) {
            if(doc.IssueId){
                var issue = Issues.findOne({_id: doc.IssueId});
                if(issue){
                    doc.order = issue.order;
                }
            }
            doc.journalId = Router.current().data()._id;
            doc.createDate = new Date();
            return doc;
        }
    },
    onSuccess: function () {
        $("#addSpecialTopicsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);