Template.showNewsArticle.helpers({
    newsArticles: function () {
        var newId = Router.current().params.newsId;
        return News.find({_id: newId});
    }
});

Template.showNewsArticle.onRendered(function(){
    var newId = Router.current().params.newsId;
    var news = News.findOne({_id: newId});
    if(news) {
        News.update({_id: news._id}, {$inc: {"pageView": 1}});
    }
});