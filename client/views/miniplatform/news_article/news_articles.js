Template.newsCenterDetails.helpers({
    newsDetails: function () {
        var newsId = Router.current().params.newsCenterId;
        return NewsCenter.find({_id: newsId});
    },
    latestNews: function () {
        return NewsCenter.find({},{sort: {releaseTime: -1}, limit: 10});
    },
    whichUrl: function () {
        if (this.link)return this.link;
        return "/miniplatform/newsCenter/" + this._id;
    },
    fields:function(){
        if(this.fileId)return true;
        return false;
    },
    wordValue:function(){
        if(this.fileId){
            var file = Collections.JournalMediaFileStore.findOne({_id:this.fileId});
            if (!file)return;
            return CDN.get_cdn_url() + file.url({auth:false});
        }
    }
});

Template.newsCenterDetails.onRendered(function(){
    var newsId = Router.current().params.newsCenterId;
    var news = NewsCenter.findOne({_id: newsId});
    if(news) {
        NewsCenter.update({_id: news._id}, {$inc: {"pageView": 1}});
    }
});