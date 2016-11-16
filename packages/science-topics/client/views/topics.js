var refreshTopicTree=function(){
    Session.set("selectedTopic", null);
    var isLangCn = TAPi18n.getLanguage() === "zh-CN";
    Meteor.call("flatTopicsToTreeNodes", isLangCn, function (err, result) {
        if (err)console.log(err)
        $('#tree').treeview({
            levels: 1,
            showBorder: false,
            data: result,
            enableLinks: true,
            onNodeSelected: function (event, node) {
                Session.set("selectedTopic", node.tags[0]);
            },
            onNodeUnselected: function (event, node) {
                Session.set("selectedTopic", null);
            }
        });
    });
}

Template.Topics.onRendered(function () {
    refreshTopicTree();
})


Template.Topics.helpers({
    selectedTopic: function () {
        return Session.get("selectedTopic");
    },
    getAddNewStr: function () {
        return TAPi18n.__("Add new");
    },
    hasNoChildTopics: function () {
        var topicId = Session.get("selectedTopic");
        if (!topicId)return true;
        if (Topics.findOne({parentId: topicId}))
            return false;
        return true;
    },
    getDoc: function () {
        var topicId = Session.get("selectedTopic");
        if (!topicId)return;
        return Topics.findOne({_id: topicId});
    },
    topicWatchState: function () {
        var topicId=Session.get("selectedTopic");
        var topic = Topics.findOne({_id: topicId});
        if (Meteor.userId() && topic) {
            if (!Meteor.user().profile)return TAPi18n.__("watchTopic");
            var pro = Meteor.user().profile.topicsOfInterest || [];
            return _.contains(pro, topic._id) ? TAPi18n.__("Watched") : TAPi18n.__("watchTopic");
        } else {
            return TAPi18n.__("watchTopic");
        }
    },
});

Template.Topics.events({
    'keyup #topic-search': function (e) {
        if (e.keyCode === 13) {
            var pattern = $('#topic-search').val();
            var options = {
                ignoreCase: true,
                exactMatch: false,
                revealResults: true
            };
            $('#tree').treeview('search', [pattern, options]);
        }
        if (e.keyCode === 8) $('#tree').treeview('collapseAll');
    },
    'click .removeTopic':function(e){
        var tid=Session.get("selectedTopic");
        confirmDelete(e,function(){
            Topics.remove({_id:tid});
            refreshTopicTree();
        })
    },
    "click .watchTopic": function () {
        var topicId=Session.get("selectedTopic");
        var topic = Topics.findOne({_id: topicId});
        if (Meteor.userId()) {
            var pro = [];
            if (Meteor.user().profile) {
                pro = Meteor.user().profile.topicsOfInterest || [];
            }
            if (_.contains(pro, topic._id)) {
                pro = _.without(pro, topic._id)
            } else {
                pro.push(topic._id);
            }
            Users.update({_id: Meteor.userId()}, {$set: {"profile.topicsOfInterest": pro}});
        }else{
            sweetAlert({
                title             : TAPi18n.__("signInOrRegister"),
                text              : TAPi18n.__("signInFirst"),
                type              : "info",
                showCancelButton  : false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText : TAPi18n.__("OK"),
                closeOnConfirm    : true
            });
            return false;
        }
    }
});

AutoForm.addHooks(['addTopicModalForm','updateTopicModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        refreshTopicTree();
    },
    before: {
        insert: function (doc) {
            if(Session.get('selectedTopic'))
                doc.parentId = Session.get('selectedTopic');
            return doc;
        }
    }
}, true);