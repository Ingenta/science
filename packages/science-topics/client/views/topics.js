Template.Topics.helpers({
    getAddNewStr: function () {
        return TAPi18n.__("Add new");
    }
});

Template.SingleTopic.events({
    'click .fa-plus': function (event) {
        event.preventDefault();
        var id = $(event.currentTarget).parent().parent().attr('id');
        Session.set("parentId", id);
        event.stopPropagation();
    },
    'click i':function(e){
        e.preventDefault();
        var id = $(event.target).parent().attr('id');
        var es = Session.get("expandStatus" + id);
        Session.set("expandStatus" + id, !es);
        e.stopPropagation();
    }
});

Template.TopicList.events({
    'keyup .refineSearch': function (event) {
        $(".parentTopicList li").hide();
        var term = $(event.currentTarget).val();
        _.each($(".parentTopicList li"), function (item) {
            var eachTopic = item.textContent.trim().toLowerCase();
            if (eachTopic && eachTopic.indexOf(term.toLowerCase().trim()) > -1) {
                recursionLi(item);
                $(item).show();
            }
        });
        function recursionLi(li) {
            var parentLi = $(li).parent().parent();
            if (parentLi && parentLi.length && !parentLi.visibility) {
                $(parentLi).show();
                recursionLi(parentLi);
            }
        }
    }
});

Template.addTopicModalForm.helpers({
    topics: function () {
        var t = Topics.find().fetch();
        var result = [];
        _.each(t,function(item){
            result.push({label:TAPi18n.getLanguage()=='zh-CN'?item.name:item.englishName,value:item._id});
        });
        return result;
    }
});
Template.updateTopicModalForm.helpers({
    topics: function () {
        var thisId = this && this._id;

        var t = Topics.find({_id:{$ne:thisId}}).fetch();
        var result = [];
        _.each(t,function(item){
            result.push({label:TAPi18n.getLanguage()=='zh-CN'?item.name:item.englishName,value:item._id});
        });
        return result;
    }
})
Template.TopicList.helpers({
    topics: function () {
        return Topics.find({"parentId": null});
    }
});

Template.TopicButtons.helpers({
    hasSubTopic: function (parentId) {
        return Topics.find({"parentId": parentId}).count() === 0;
    },
    searchUrl: function(){
        var option = {
            filterQuery:{
                topic:[this._id]
            },
            setting:{from:'topic'}
        };
        return SolrQuery.makeUrl(option);
    },
    getAddNewStr: function () {
        return TAPi18n.__("Add new");
    },
    getUpdateStr: function () {
        return TAPi18n.__("Update");
    }
});

Template.SingleTopic.helpers({
    subTopicCount: function (parentId) {
        return Topics.find({"parentId": parentId}).count();
    },
    subTopics: function (parentId) {
        return Topics.find({"parentId": parentId});
    },
    isExpand: function (id) {
        return Session.get("expandStatus" + id) || false;
    },
    isParentExpand: function (id) {
        var topic = Topics.findOne({_id: id});
        return Session.get("expandStatus" + topic.parentId);
    }
});

Template.deleteTopicModalForm.helpers({
    getPrompt: function () {
        return TAPi18n.__("Are you sure?");
    }
});

AutoForm.addHooks(['addTopicModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.parentId = Session.get('parentId');
            return doc;
        }
    }
}, true);
