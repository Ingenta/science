Template.sortByResults.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.newsSearchShowPage.helpers({
    'results': function () {
        var q = Router.current().params.searchQuery;
        if (q) {
            var sort = {};
            if(Session.get("sort"))sort={"releaseTime":Session.get("sort")};
            var mongoDbArr = [];
            mongoDbArr.push({'title.en': {$regex: q, $options: "i"}});
            mongoDbArr.push({'title.cn': {$regex: q, $options: "i"}});
            mongoDbArr.push({'author.en': {$regex: q, $options: "i"}});
            mongoDbArr.push({'author.cn': {$regex: q, $options: "i"}});
            mongoDbArr.push({'abstract.en': {$regex: q, $options: "i"}});
            mongoDbArr.push({'abstract.cn': {$regex: q, $options: "i"}});
            return NewsCenter.find({$or: mongoDbArr},{sort: sort,limit:20});
        }
    },
    whichUrl: function () {
        if (this.link)return this.link;
        return "/miniplatform/newsCenter/" + this._id;
    }
});