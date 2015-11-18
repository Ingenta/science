AutoForm.addHooks(['suggestedArticlesModalForm'], {
    onSuccess: function () {
        $("#suggestedArticlesModal").modal('hide');
    }
}, true);


Template.suggestedMostReadModalForm.helpers({
    getArticles: function () {
        var isChinese = TAPi18n.getLanguage() === 'zh-CN';
        var articles = Articles.find().fetch();
        if (!articles)return;
        var result = [];
        _.each(articles, function (item) {
            if(item.title) {
                var name = isChinese ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            }
        });
        return result;
    }
});
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