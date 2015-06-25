Meteor.startup(function(){
    Router.route("login", {
        parent: "home_private",
        path: "/login",
        controller: "LoginController",
        title: function () {
            return TAPi18n.__("Login");
        }
    });
    Router.route("register", {
        parent: "home_private",
        path: "/register",
        controller: "RegisterController",
        title: function () {
            return TAPi18n.__("Register");
        }
    });

    Router.route("forgot_password", {
        path: "/forgot_password",
        controller: "ForgotPasswordController",
        parent: "home_private",
        title: function () {
            return TAPi18n.__("Forgot password");
        }
    });
    Router.route("reset_password", {
        path: "/reset_password/:resetPasswordToken",
        controller: "ResetPasswordController",
        parent: "home_private",
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
        parent: "home_private"
    });
    Router.route("admin.roles", {
        path: "/admin/roles",
        controller: "AdminRolesController"
    });
    Router.route("admin.roles.insert", {
        path: "/admin/roles/insert",
        controller: "AdminRolesInsertController"
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
