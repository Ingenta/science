Router.route("/authorCenter/", {
    parent: "home",
    name: "authorCenter",
    template:"authorCenter",
    title: function () {
        return TAPi18n.__("Author Center");
    },
    waitOn: function () {
        return [
            HomePageSubs.subscribe('publishers'),
            HomePageSubs.subscribe('HomeAdvertisementShowPage'),
            HomePageSubs.subscribe('publications')
        ]
    }
});
