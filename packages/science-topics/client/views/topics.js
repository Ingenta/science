Template.SingleTopic.events({
    'click .fa': function (event) {
       var id=$(event.currentTarget).parent().attr('id');
       var es=Session.get("expandStatus"+id);
       Session.set("expandStatus"+id,!es);
       Session.set("parentId", id);
       event.stopPropagation();
    }
});

Template.TopicList.events({
    'keyup .refineSearch': function(event) {
        $(".parentTopicList li").hide();
        var term = $(event.currentTarget).val();
        _.each($(".parentTopicList li"), function (item) {
            var eachTopic = item.textContent.trim().toLowerCase();
            if (eachTopic && eachTopic.indexOf(term.toLowerCase().trim()) > -1) {
                recursionLi(item);
                $(item).show();
            }
        });
        function recursionLi(li){
            var parentLi = $(li).parent().parent();
            if(parentLi && parentLi.length && !parentLi.visibility){
                $(parentLi).show();
                recursionLi(parentLi);
            }
        }
    }
});

Template.addSubTopicModalForm.events({
    'click .fa': function (event) {
        var id=$(event.currentTarget).parent().parent().attr('id');
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
    },
    isParentExpand:function(id){
        var topic=Topics.findOne({_id:id});
        return Session.get("expandStatus" + topic.parentId);
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
            doc.parentId = Session.get('parentId');
            return doc;
        }
    }
}, true);
