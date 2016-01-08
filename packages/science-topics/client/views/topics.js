var reactDic = new ReactiveDict();

Template.Topics.onCreated(function(){
    reactDic.set("canAdd",Permissions.userCan("add-topic","topic",Meteor.userId()));
    reactDic.set("canModify",Permissions.userCan("modify-topic","topic",Meteor.userId()));
    reactDic.set("canDel",Permissions.userCan("delete-topic","topic",Meteor.userId()));
    reactDic.set("canAddArticle",Permissions.userCan("add-article-to-topic","topic",Meteor.userId()))
    reactDic.set("anyPermission",reactDic.get("canAdd") || reactDic.get("canModify") || reactDic.get("canDel") || reactDic.get("canAddArticle"));
})
Template.Topics.onRendered(function(){
    Meteor.setTimeout(function(){
        if(reactDic.get("anyPermission")){
            Topics.find().forEach(function(oneTopic){
                var currTag=$("#"+oneTopic._id);
                if(!currTag.length) return;
                var ctlpanel=currTag.find(">.control-panel");
                ctlpanel.children().remove();
                Blaze.renderWithData(Template.controlPanel,oneTopic,ctlpanel[0]);
            })
        }
    },100)
})

Template.Topics.helpers({
    getAddNewStr: function () {
        return TAPi18n.__("Add new");
    }
});

Template.Topics.events({
    'keyup .refineSearch': function (e) {
        $(".parentTopicList li").hide();
        var term = $(e.currentTarget).val();
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
})

Template.TopicList.events({
    'click i':function(e){
        e.preventDefault();
        e.stopPropagation();
        var id = $(e.target).parent().attr('id');
        var es = reactDic.get("expandStatus" + id);
        reactDic.set("expandStatus" + id, !es);
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
    topics:function(){
        return Topics.find({parentId:this.parent})
    },
    subTopicCount: function () {
        if(Session.get("subTopicCount" + this._id)===undefined){
            var stc=Topics.find({"parentId": this._id}).count();
            Session.set("subTopicCount"+ this._id,stc);
        }
        return Session.get("subTopicCount" + this._id);
    },
    isExpand: function () {
        var es = reactDic.get("expandStatus" + this._id) || false;
        var subul = $("li#"+this._id+">ul");
        if(subul.length){
            es?subul.show():subul.hide();
        }
        return es;
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
    isTop:function(){
        return !Template.currentData()
    },
    hasAnyPermission:function(){
        return reactDic.get("anyPermission");
    }
});

Template.deleteTopicModalForm.helpers({
    getPrompt: function () {
        return TAPi18n.__("Are you sure?");
    }
});

Template.controlPanel.helpers({
    canAdd:function(){
        return reactDic.get("canAdd")
    },
    canModify:function(){
        return reactDic.get("canModify")
    },
    canDel:function(){
        return reactDic.get("canDel") && !Session.get("subTopicCount" + this._id)
    },
    canAddArticle:function(){
        return reactDic.get("canAddArticle")
    }
})

Template.controlPanel.events({
    'click .fa-plus': function (e) {
        e.preventDefault();
        var id = $(e.currentTarget).parent().parent().attr('id');
        Session.set("parentId", id);
        e.stopPropagation();
    }
})

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
