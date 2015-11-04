Template.dynamicShow.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.newsSearchShowPage.helpers({
    'results': function () {
        var q = Router.current().params.searchQuery;
        if (q) {
            var sort = {};
            if(Session.get("sort"))sort={"createDate":Session.get("sort")};
            var mongoDbArr = [];
            mongoDbArr.push({'title': {$regex: q, $options: "i"}});
            mongoDbArr.push({author: {$regex: q, $options: "i"}});
            mongoDbArr.push({abstract: {$regex: q, $options: "i"}});
            return NewsCenter.find({$or: mongoDbArr},{sort: sort});
        }
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});