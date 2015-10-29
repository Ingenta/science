Template.newsCenterDetails.helpers({
    newsDetails: function () {
        var newsId = Router.current().params.newsCenterId;
        return NewsCenter.find({_id: newsId});
    },
    latestNews: function () {
        return NewsCenter.find({},{sort: {createDate: -1}});
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});
