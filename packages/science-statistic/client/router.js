Router.route("/statistic/", {
    template: "Admin",
    name: "admin.statistic",
    parent: "admin",
    yieldTemplates: {
        'statistic': {to: 'AdminSubcontent'}
    },
    title: function () {
        return TAPi18n.__("Statistical Management");
    }
});