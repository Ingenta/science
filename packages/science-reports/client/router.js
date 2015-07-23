Router.route("/reports/", {
    template      : "reports",
    name          : "admin.reports",
    parent        : "admin",
    title         : function () {
        return "fdf";
    }
//    waitOn        : function () {
//        return [
//            Meteor.subscribe('allCollections'),
//            Meteor.subscribe('images'),
//            Meteor.subscribe('publishers')
//        ]
//    }
});