Router.route("admin", {
    path: "/admin",
    controller: "AdminController",
    title: function () {
        return TAPi18n.__("Admin");
    },
    parent: "home"
});
Router.route("admin.email", {
    path: "/admin/email",
    title: function () {
        return TAPi18n.__("Email");
    },
    parent: "admin",
    template: "Admin",
    yieldTemplates: {
        'AdminEmail': {to: 'AdminSubcontent'}
    },
    waitOn: function () {
        return [
            Meteor.subscribe("emailConfig")
        ]
    }
});
Router.route("admin.roles", {
    path: "/admin/roles",
    controller: "AdminRolesController",
    title: function () {
        return TAPi18n.__("roles");
    },
    parent: "admin"
});
Router.route("admin.roles.insert", {
    path: "/admin/roles/insert",
    controller: "AdminRolesInsertController",
    title: function () {
        return TAPi18n.__("newRole");
    },
    parent: "admin.roles"
});
Router.route("admin.roles.update", {
    path: "/admin/roles/update/:roleId",
    title: function () {
        return "update"
    },
    parent: "admin.roles",
    template: "Admin",
    yieldTemplates: {
        'AdminRoleEdit': {to: 'AdminSubcontent'}
    },
    onBeforeAction: function () {
        Permissions.check("edit-custom-roles", "permissions");
        this.next();
    }
});
Router.route("admin.roles.choose.permissions", {
    path: "/admin/roles/:roleId/choose",
    template: "Admin",
    yieldTemplates: {
        'AdminChoosePermissions': {to: 'AdminSubcontent'}
    },
    title: function () {
        return TAPi18n.__("choosePermissions");
    },
    parent: "admin.roles",
    onBeforeAction: function () {
        Permissions.check("edit-custom-roles", "permissions");
        this.next();
    }
});
Router.route("admin.users", {
    path: "/admin/users",
    controller: "AdminUsersController",
    title: function () {
        return TAPi18n.__("Account");
    },
    parent: "admin",
    waitOn: function () {
        return [
            Meteor.subscribe('file_excel')
        ]
    }
});
Router.route("admin.users.details", {
    path: "/admin/users/details/:userId",
    controller: "AdminUsersDetailsController",
    title: function () {
        return TAPi18n.__("User details");
    },
    parent: "admin.users"
});
Router.route("admin.users.insert", {
    path: "/admin/users/insert",
    controller: "AdminUsersInsertController",
    title: function () {
        return TAPi18n.__("Add new user");
    },
    parent: "admin.users"
});
Router.route("admin.users.edit", {
    path: "/admin/users/edit/:userId",
    controller: "AdminUsersEditController",
    title: function () {
        return TAPi18n.__("Edit user");
    },
    parent: "admin.users",
    waitOn: function () {
        return [
            Meteor.subscribe('publishers'),
            Meteor.subscribe('institutions')
        ]
    },
    data: function () {
        return {scope: {publisher: Users.findOne(Router.current().param.userId).publisherId}};
    }
});
Router.route("admin.tag", {
    path: "/admin/tag",
    title: function () {
        return TAPi18n.__("Journal label");
    },
    parent: "admin",
    template: "Admin",
    yieldTemplates: {
        'AdminTag': {to: 'AdminSubcontent'}
    },
    waitOn: function () {
        return [
            Meteor.subscribe("tag"),
            Meteor.subscribe('pages')
        ]
    }
});
Router.route("admin.logs", {
    path: "/admin/logs",
    title: function () {
        return TAPi18n.__("Logs");
    },
    parent: "admin",
    template: "Admin",
    yieldTemplates: {
        'AdminLogs': {to: 'AdminSubcontent'}
    },
    waitOn: function () {
        return [
            Meteor.subscribe("latestFiftyLogs")
        ]
    }
});