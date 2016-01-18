Template.Topics.onRendered(function () {
    Session.set("selectedTopic", null);
    var isLangCn = TAPi18n.getLanguage() === "zh-CN";
    $('#tree').treeview({
        levels: 1,
        showBorder: false,
        data: flatTopicsToTreeNodes(isLangCn),
        showTags: true,
        enableLinks: true,
        onNodeSelected: function (event, node) {
            Session.set("selectedTopic", node.tags[0]);
        },
        onNodeUnselected: function (event, node) {
            Session.set("selectedTopic", null);
        }
    });
})
var getSearchUrl = function(id){
    return SolrQuery.makeUrl(
        {
            filterQuery:{
                topic:[id]
            },
            setting:{from:'topic'}
        }
    );
}

flatTopicsToTreeNodes = function (isLangCn) {
    var topicTree = [];
    _.each(Topics.find({parentId: null}).fetch(), function (topic) {
        var thisTopic = {text: isLangCn ? topic.name : topic.englishName, tags: [topic._id], href: getSearchUrl(topic._id)};
        var childTopics = [];
        _.each(Topics.find({parentId: topic._id}).fetch(), function (child) {
            var oneChild = {text: isLangCn ? child.name : child.englishName, tags: [child._id], href: getSearchUrl(child._id)};
            var grandchildTopics = [];
            _.each(Topics.find({parentId: child._id}).fetch(), function (grandchild) {
                var oneGrandchild = {text: isLangCn ? grandchild.name : grandchild.englishName, tags: [grandchild._id], href: getSearchUrl(grandchild._id)};
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
Template.Topics.helpers({
    selectedTopic: function () {
        return Session.get("selectedTopic");
    },
    getAddNewStr: function () {
        return TAPi18n.__("Add new");
    },
    hasNoChildTopics: function () {
        var topicId = Session.get("selectedTopic");
        if(!topicId)return true;
        if (Topics.findOne({parentId: topicId}))
            return false;
        return true;
    },
    getDoc: function () {
        var topicId = Session.get("selectedTopic");
        if(!topicId)return;
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

//var reactDic = new ReactiveDict();
//
//
//Template.Topics.onCreated(function(){
//    reactDic.set("canAdd",Permissions.userCan("add-topic","topic",Meteor.userId()));
//    reactDic.set("canModify",Permissions.userCan("modify-topic","topic",Meteor.userId()));
//    reactDic.set("canDel",Permissions.userCan("delete-topic","topic",Meteor.userId()));
//    reactDic.set("canAddArticle",Permissions.userCan("add-article-to-topic","topic",Meteor.userId()))
//    reactDic.set("anyPermission",reactDic.get("canAdd") || reactDic.get("canModify") || reactDic.get("canDel") || reactDic.get("canAddArticle"));
//})
//Template.Topics.onRendered(function(){
//    Meteor.setTimeout(function(){
//        if(reactDic.get("anyPermission")){
//
//        }
//    },100)
//})
//
//Template.Topics.helpers({
//    getAddNewStr: function () {
//        return TAPi18n.__("Add new");
//    }
//});
//
//Template.Topics.events({
//    'keyup .refineSearch': function (e) {
//        $(".parentTopicList li").hide();
//        var term = $(e.currentTarget).val();
//        _.each($(".parentTopicList li"), function (item) {
//            var eachTopic = item.textContent.trim().toLowerCase();
//            if (eachTopic && eachTopic.indexOf(term.toLowerCase().trim()) > -1) {
//                recursionLi(item);
//                $(item).show();
//            }
//        });
//        function recursionLi(li) {
//            var parentLi = $(li).parent().parent();
//            if (parentLi && parentLi.length && !parentLi.visibility) {
//                $(parentLi).show();
//                recursionLi(parentLi);
//            }
//        }
//    }
//})
//
//Template.TopicList.events({
//    'click i':function(e){
//        e.preventDefault();
//        e.stopPropagation();
//        var id = $(e.target).parent().attr('id');
//        var es = reactDic.get("expandStatus" + id);
//        reactDic.set("expandStatus" + id, !es);
//    }
//});
//
//Template.addTopicModalForm.helpers({
//    topics: function () {
//        var t = Topics.find().fetch();
//        var result = [];
//        _.each(t,function(item){
//            result.push({label:TAPi18n.getLanguage()=='zh-CN'?item.name:item.englishName,value:item._id});
//        });
//        return result;
//    }
//});
//Template.updateTopicModalForm.helpers({
//    topics: function () {
//        var thisId = this && this._id;
//
//        var t = Topics.find({_id:{$ne:thisId}}).fetch();
//        var result = [];
//        _.each(t,function(item){
//            result.push({label:TAPi18n.getLanguage()=='zh-CN'?item.name:item.englishName,value:item._id});
//        });
//        return result;
//    }
//})
//
//Template.TopicList.helpers({
//    topics:function(){
//        return Topics.find({parentId:this.parent})
//    },
//    subTopicCount: function () {
//        if(Session.get("subTopicCount" + this._id)===undefined){
//            var stc=Topics.find({"parentId": this._id}).count();
//            Session.set("subTopicCount"+ this._id,stc);
//        }
//        return Session.get("subTopicCount" + this._id);
//    },
//    isExpand: function () {
//        var es = reactDic.get("expandStatus" + this._id) || false;
//        var subul = $("li#"+this._id+">ul");
//        if(subul.length){
//            es?subul.show():subul.hide();
//        }
//        return es;
//    },
//    searchUrl: function(){
//        var option = {
//            filterQuery:{
//                topic:[this._id]
//            },
//            setting:{from:'topic'}
//        };
//        return SolrQuery.makeUrl(option);
//    },
//    isTop:function(){
//        return !Template.currentData()
//    },
//    hasAnyPermission:function(){
//        return reactDic.get("anyPermission");
//    }
//});
//
//Template.deleteTopicModalForm.helpers({
//    getPrompt: function () {
//        return TAPi18n.__("Are you sure?");
//    }
//});
//
//Template.controlPanel.helpers({
//    canAdd:function(){
//        return reactDic.get("canAdd")
//    },
//    canModify:function(){
//        return reactDic.get("canModify")
//    },
//    canDel:function(){
//        return reactDic.get("canDel") && !Session.get("subTopicCount" + this._id)
//    },
//    canAddArticle:function(){
//        return reactDic.get("canAddArticle")
//    }
//})
//
//Template.controlPanel.events({
//    'click .fa-plus': function (e) {
//        e.preventDefault();
//        var id = $(e.currentTarget).parent().parent().attr('id');
//        Session.set("parentId", id);
//        e.stopPropagation();
//    }
//})
//
//AutoForm.addHooks(['addTopicModalForm'], {
//    onSuccess: function () {
//        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
//    },
//    before: {
//        insert: function (doc) {
//            doc.parentId = Session.get('parentId');
//            return doc;
//        }
//    }
//}, true);
