Template.showNewsArticle.helpers({
    newsArticles: function () {
        var newId = Router.current().params.newsId;
        return News.find({_id: newId});
    }
});