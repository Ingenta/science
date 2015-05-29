Template.SingleTopic.events({
   'click li': function (event) {
       var k=event.currentTarget.textContent.trim();
       var es=Session.get("expandStatus"+k);
       Session.set("expandStatus"+k,!es);
       //阻止事件继续传播
       event.stopPropagation();
   }
});

Template.TopicList.helpers({
    topics: function () {
        return  Topics.find({"parentName" : null});
    }
});
Template.SingleTopic.helpers({
    removeSpaces: function (name) {
        return  replaceSubstrings(name, ' ', '');
    },
    subTopicCount: function (parentName) {
        return  Topics.find({"parentName" : parentName}).count();
    },
    subTopics: function (parentName) {
        return  Topics.find({"parentName" : parentName});
    },
    isExpand: function(name){
        return Session.get("expandStatus"+name) || false;
    }
});
