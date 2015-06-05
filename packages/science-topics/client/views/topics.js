Template.SingleTopic.events({
   'click .fa': function (event) {
       var id=$(event.currentTarget).parent().attr('id');
       var es=Session.get("expandStatus"+id);
       Session.set("expandStatus"+id,!es);
       Session.set("parentId", id);
       event.stopPropagation();
   }
});

Template.TopicList.helpers({
    topics: function () {
        return  Topics.find({"parentId" : null});
    }
});
Template.TopicButtons.helpers({
    hasSubTopic: function (parentId) {
        return  Topics.find({"parentId": parentId}).count()===0;
    }
});
Template.SingleTopic.helpers({
    subTopicCount: function (parentId) {
        return  Topics.find({"parentId" : parentId}).count();
    },
    subTopics: function (parentId) {
        return  Topics.find({"parentId" : parentId});
    },
    isExpand: function(id){
        return Session.get("expandStatus"+id) || false;
    }
});

Template.deleteTopicModalForm.helpers({
    getPrompt: function () {
        return TAPi18n.__("Are you sure?");
    }
});


AutoForm.addHooks(['addSubTopicModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before:{
        insert:  function(doc){
            console.log(doc);
            doc.parentId = Session.get('parentId');
            console.log(doc);
            return doc;
        }
    }
}, true);