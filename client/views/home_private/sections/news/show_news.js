Template.showNewsArticle.helpers({
    newsArticles: function () {
        var newId = Router.current().params.newsId;
        return News.find({_id: newId});
    },
    fields:function(){
        if(this.fileId)return true;
        return false;
    },
    wordValue:function(){
        if(this.fileId===undefined){
            return null;
        }
        var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
        return file.url()+"&download=true";
    }
});

Template.showNewsArticle.onRendered(function(){
    var newId = Router.current().params.newsId;
    var news = News.findOne({_id: newId});
    if(news) {
        News.update({_id: news._id}, {$inc: {"pageView": 1}});
    }
});