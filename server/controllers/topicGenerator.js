Meteor.methods({
    'flatTopicsToTreeNodes': function (isLangCn) { //TODO: don't regenerate this each time a user visits the page only when the data is changed.
        var topicTree = [];
        _.each(Topics.find({parentId: null}).fetch(), function (topic) {
            var thisTopic = {
                text: isLangCn ? topic.name : topic.englishName,
                tags: [topic._id],
                href: getSearchUrl(topic._id)
            };
            var childTopics = [];
            _.each(Topics.find({parentId: topic._id}).fetch(), function (child) {
                var oneChild = {
                    text: isLangCn ? child.name : child.englishName,
                    tags: [child._id],
                    href: getSearchUrl(child._id)
                };
                var grandchildTopics = [];
                _.each(Topics.find({parentId: child._id}).fetch(), function (grandchild) {
                    var oneGrandchild = {
                        text: isLangCn ? grandchild.name : grandchild.englishName,
                        tags: [grandchild._id],
                        href: getSearchUrl(grandchild._id)
                    };
                    grandchildTopics.push(oneGrandchild)
                })
                if (!_.isEmpty(grandchildTopics))
                    oneChild.nodes = grandchildTopics;
                childTopics.push(oneChild)
            })
            if (!_.isEmpty(childTopics))
                thisTopic.nodes = childTopics;
            topicTree.push(thisTopic)
        })
        return topicTree;
    }
})
var getSearchUrl = function (id) {
    return '/search?fq={"topic":"'+id+'"}&st={"from":"topic"}';
}
