Template.dynamicShow.helpers({
    mostMagazines: function () {
        var sort = {};
        if(Session.get("sort"))sort={"releaseTime":Session.get("sort")};
        return NewsCenter.find({recommend:"1",types:"2"},{sort: sort, limit: 20});
    },
    whichUrl: function () {
        if (this.link) {
            return this.link;
        }
        return "/miniplatform/newsCenter/" + this._id;
    }
});