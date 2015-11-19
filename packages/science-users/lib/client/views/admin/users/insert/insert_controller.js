this.AdminUsersInsertController = RouteController.extend({
    template: "Admin",

    yieldTemplates: {
        'AdminUsersInsert': {to: 'AdminSubcontent'}
    },

    onBeforeAction: function () {
        Permissions.check("add-user", "user");
        this.next();
    }
});