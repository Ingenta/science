Router.route("/statistic/", {
    template: "Admin",
    name: "admin.statistic",
    parent: "admin",
    yieldTemplates: {
        'statistic': {to: 'AdminSubcontent'}
    },
    title: function () {
        return TAPi18n.__("Statistical Management");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('institutions'),
        ]
    }
});
Router.route("/reports/", {
    template      : "Admin",
    name          : "admin.reports",
    parent        : "admin",
    yieldTemplates: {
        'reports': { to: 'AdminSubcontent'}
    },
    title         : function () {
        return TAPi18n.__("Reports");
    }
});
