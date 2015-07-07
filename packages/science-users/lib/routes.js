Meteor.startup(function(){
    Router.route("login", {
        parent: "home",
        path: "/login",
        controller: "LoginController",
        title: function () {
            return TAPi18n.__("Login");
        }
    });
    Router.route("register", {
        parent: "home",
        path: "/register",
        controller: "RegisterController",
        title: function () {
            return TAPi18n.__("Register");
        }
    });

    Router.route("forgot_password", {
        path: "/forgot_password",
        controller: "ForgotPasswordController",
        parent: "home",
        title: function () {
            return TAPi18n.__("Forgot password");
        }
    });
    Router.route("reset_password", {
        path: "/reset_password/:resetPasswordToken",
        controller: "ResetPasswordController",
        parent: "home",
        title: function () {
            return TAPi18n.__("Reset password");
        }
    });

    Router.route("admin", {
        path: "/admin",
        controller: "AdminController",
        title: function () {
            return TAPi18n.__("Admin");
        },
        parent: "home"
    });
    Router.route("admin.roles", {
        path: "/admin/roles",
        controller: "AdminRolesController",
        title:function(){
            return TAPi18n.__("roles");
        },
        parent: "home"
    });
    Router.route("admin.roles.insert", {
        path: "/admin/roles/insert",
        controller: "AdminRolesInsertController",
        title:function(){
            return TAPi18n.__("newRole");
        },
        parent: "admin.roles"
    });
    Router.route("admin.roles.update", {
        path: "/admin/roles/update/:roleId",
        title:function(){return "update"},
        parent:"admin.roles",
        template: "Admin",
        yieldTemplates: {
            'AdminRoleEdit': { to: 'AdminSubcontent'}
        }
    });
    Router.route("admin.roles.choose.permissions",{
        path:"/admin/roles/:roleId/choose",
        template:"Admin",
        yieldTemplates: {
            'AdminChoosePermissions': { to: 'AdminSubcontent'}
        },
        title:function(){
            return TAPi18n.__("choosePermissions");
        },
        parent:"admin.roles"
    });
    Router.route("admin.upload", {
        path: "/admin/upload",
        title: function () {
            return TAPi18n.__("Upload");
        },
        parent: "admin"
    });

    Router.route("admin.users", {
        path: "/admin/users",
        controller: "AdminUsersController",
        title: function () {
            return TAPi18n.__("Users");
        },
        parent: "admin"
    });
    Router.route("admin.users.details", {
        path: "/admin/users/details/:userId",
        controller: "AdminUsersDetailsController"
    });
    Router.route("admin.users.insert", {
        path: "/admin/users/insert",
        controller: "AdminUsersInsertController"
    });
    Router.route("admin.users.edit", {
        path: "/admin/users/edit/:userId",
        controller: "AdminUsersEditController"
    });
    Router.route("user_settings", {
        path: "/user_settings",
        controller: "UserSettingsController"
    });
    Router.route("user_settings.profile", {
        path: "/user_settings/profile",
        controller: "UserSettingsProfileController"
    });
    Router.route("user_settings.change_pass", {
        path: "/user_settings/change_pass",
        controller: "UserSettingsChangePassController"
    });
    Router.route("user_settings.update_information", {
        path: "/user_settings/update_information",
        controller: "UserSettingsUpdateInformationController",
		waitOn:function () {
            return [
                Meteor.subscribe('topics'),
                Meteor.subscribe('publications')
            ]
        }
    });
    Router.route("logout", {
        path: "/logout",
        controller: "LogoutController"
    });
});
