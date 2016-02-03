Template.newsShow.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.newsShow.helpers({
    mostNews: function () {
        var sort = {};
        if(Session.get("sort"))sort={"releaseTime":Session.get("sort")};
        return NewsCenter.find({recommend:"1",types:"1"},{sort: sort, limit: 20});
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});