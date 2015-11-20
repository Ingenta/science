this.AdminUsersController = RouteController.extend({
    template: "Admin",


    yieldTemplates: {
        'AccountTabsTemplate': {to: 'AdminSubcontent'}

    },

    onBeforeAction: function () {
        Session.set("user-search-string-for-admin","");
        Session.set("user-search-string-for-publisher","");
        Session.set("user-search-string-for-institution","");
        Session.set("user-search-string-for-normal","");
        Permissions.check("list-user", "user");
        this.next();
    }
});