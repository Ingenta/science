Template.showNewsArticle.helpers({
    newsArticles: function () {
        var newId = Router.current().params.newsId;
        if(newId)return News.find({_id: newId});
    },
    wordValue:function(){
        if(this.fileId) {
            var file = Collections.JournalMediaFileStore.findOne({_id: this.fileId});
            return file.url({auth: false});
        }
    }
});

Template.showNewsArticle.onRendered(function(){
    var newId = Router.current().params.newsId;
    var news = News.findOne({_id: newId});
    if(news) {
        News.update({_id: news._id}, {$inc: {"pageView": 1}});
    }
});