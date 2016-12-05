Template.suggestedMostReadButtons.helpers({
    hasSuggestedArticle: function () {
        if (!SuggestedArticles.findOne())return;
        return true;
    },
    isHomePage: function () {
        return Router.current().route.getName() === "home";
    }
})
Template.suggestedMostReadButtons.events({
    'click .fa-trash': function (e) {
        if (!SuggestedArticles.findOne())return;
        var id = SuggestedArticles.findOne()._id;
        confirmDelete(e, function () {
            SuggestedArticles.remove({_id: id});
            Meteor.subscribe("insertHomeMostReadArticles");
        })
    }
})
Template.suggestedMostReadElement.helpers({
    hasSuggestedArticle: function () {
        if (!SuggestedArticles.findOne())return;
        return true;
    },
    getSuggestedArticleId: function () {
        if (!SuggestedArticles.findOne())return;
        return SuggestedArticles.findOne().articleId;
    },
    getSuggestedArticleName: function () {
        if (!SuggestedArticles.findOne())return;
        var articleId = SuggestedArticles.findOne().articleId;
        var a = Articles.findOne({_id: articleId});
        if(!a)return;
        return TAPi18n.getLanguage() === 'zh-CN' ? a.title.cn : a.title.en;
    }
})

Template.suggestedMostReadModalForm.events({
    "click #saveSuggestedMostRead":function(e,t){
        var articleId = t.$("#saSelectorForMostRead").select2('val');
        SuggestedArticles.insert({articleId:articleId});
        $("#suggestedArticlesModal").modal('hide');
        Meteor.subscribe("insertHomeMostReadArticles");
    }
})