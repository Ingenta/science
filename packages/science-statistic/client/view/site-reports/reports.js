Template.reports.helpers({
    totalConnections: function () {
        Meteor.call("totalConnections", function (e, r) {
            if (!e)return Session.set("totalConnections", r);
        });
        return Session.get("totalConnections");
    },
    totalRegisteredUsers: function () {
        return Users.find().count();
    },
    totalPublishers: function () {
        return Publishers.find().count();
    },
    totalJournals: function () {
        return Publications.find().count();
    },
    totalArticles: function () {
        Meteor.call("totalArticles", function (e, r) {
            if (!e)return Session.set("totalArticles", r);
        });
        return Session.get("totalArticles");
    }
});
