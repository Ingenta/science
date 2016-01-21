Template.Topics.onRendered(function () {
    Session.set("selectedTopic", null);
    var isLangCn = TAPi18n.getLanguage() === "zh-CN";
    //$('#tree').treeview({
    //    levels: 1,
    //    showBorder: false,
    //    data: flatTopicsToTreeNodes(isLangCn),
    //    enableLinks: true,
    //    onNodeSelected: function (event, node) {
    //        Session.set("selectedTopic", node.tags[0]);
    //    },
    //    onNodeUnselected: function (event, node) {
    //        Session.set("selectedTopic", null);
    //    }
    //});
})
var getSearchUrl = function (id) {
    return SolrQuery.makeUrl(
        {
            filterQuery: {
                topic: [id]
            },
            setting: {from: 'topic'}
        }
    );
}

//flatTopicsToTreeNodes = function (isLangCn) {
//    var topicTree = [];
//    _.each(Topics.find({parentId: null}).fetch(), function (topic) {
//        var thisTopic = {
//            text: isLangCn ? topic.name : topic.englishName,
//            tags: [topic._id],
//            href: getSearchUrl(topic._id)
//        };
//        var childTopics = [];
//        _.each(Topics.find({parentId: topic._id}).fetch(), function (child) {
//            var oneChild = {
//                text: isLangCn ? child.name : child.englishName,
//                tags: [child._id],
//                href: getSearchUrl(child._id)
//            };
//            var grandchildTopics = [];
//            _.each(Topics.find({parentId: child._id}).fetch(), function (grandchild) {
//                var oneGrandchild = {
//                    text: isLangCn ? grandchild.name : grandchild.englishName,
//                    tags: [grandchild._id],
//                    href: getSearchUrl(grandchild._id)
//                };
//                grandchildTopics.push(oneGrandchild)
//            })
//            if (!_.isEmpty(grandchildTopics))
//                oneChild.nodes = grandchildTopics;
//            childTopics.push(oneChild)
//        })
//        if (!_.isEmpty(childTopics))
//            thisTopic.nodes = childTopics;
//        topicTree.push(thisTopic)
//    })
//    return topicTree;
//}
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

AutoForm.addHooks(['addTopicModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
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
        if(e.keyCode === 8) $('#tree').treeview('collapseAll');
    }
})