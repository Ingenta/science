Router.route("home", {
    path: "/",
    controller: "HomePrivateController",
    title: function () {
        return TAPi18n.__("Home");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('publishers'),
            Meteor.subscribe('homepageMostRecentArticles'),
            Meteor.subscribe('topics'),
            Meteor.subscribe('images'),
            Meteor.subscribe('news'),
            Meteor.subscribe('mostCited'),
            Meteor.subscribe('mostRead', undefined, 5)
        ]
    }
});
