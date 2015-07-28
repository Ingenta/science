Router.route("/reports/", {
    template      : "Admin",
    name          : "admin.reports",
    parent        : "admin",
    yieldTemplates: {
        'reports': { to: 'AdminSubcontent'}
    },
    title         : function () {
        return TAPi18n.__("Reports");
    },
    waitOn        : function () {
        return [
            Meteor.subscribe('allconnections')
        ]
    }
});
