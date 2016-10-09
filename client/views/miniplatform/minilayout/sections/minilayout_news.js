Template.layoutRightNews.helpers({
    layoutRecommendMagazines: function () {
        return NewsCenter.find({recommend:"1",types:"2"},{sort: {releaseTime: -1}, limit: 5});
    },
    layoutPublishingMagazines: function () {
        return NewsCenter.find({recommend:"1",types:"3"},{sort: {releaseTime: -1}, limit: 5});
    },
    whichUrl: function () {
        if (this.link)return this.link;
        return "/miniplatform/newsCenter/" + this._id;
    }
});