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
    }
})