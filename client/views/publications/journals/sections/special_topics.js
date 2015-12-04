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
    }
});

Template.SpecialTopics.helpers({
    specialTopics: function () {
        return SpecialTopics.find({journalId:this._id});
    },
    year: function () {
        var id = Session.get("currentJournalId");
        var issue = Issues.findOne({journalId: id});
        if (issue)
            return issue.year;
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
        return journalPart + "/specialTopics/" + specialTopicId;
    },
    getData:function(){
        return _.extend({specialTopicsId:this._id},Router.current().params);
    }
})

AutoForm.addHooks(['addSpecialTopicsModalForm'], {
    before: {
        insert: function (doc) {
            doc.journalId = Router.current().data()._id;
            return doc;
        }
    },
    onSuccess: function () {
        $("#addSpecialTopicsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);