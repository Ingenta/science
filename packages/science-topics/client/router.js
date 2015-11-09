Router.route("/topics/", {
    parent: "home",
    name: "topics",
    template:"Topics",
    title: function () {
        return TAPi18n.__("Topics");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('topics')
        ]
    },
    onBeforeAction: function () {
        Session.set('PerPage', 10);
        Session.set('journalId', undefined);
        this.next();
    }
});

Router.route("topics/:topicsId/", {
    template      : "addArticleForTopics",
    name          : "topics.selectArticles",
    parent        : "topics",
    title: function () {
        return TAPi18n.__("addArticleToCollection");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('topics'),
            Meteor.subscribe('articles'),
            Meteor.subscribe('publications'),
            Meteor.subscribe('publishers')
        ]
    }
});