Meteor.startup(function () {
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
    Router.route("enroll-account", {
        path: "/enroll-account/:resetPasswordToken",
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
        waitOn:function(){
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('institutions')
            ]
        }
    });
    Router.route("user_settings", {
        path: "/user_settings",
        controller: "UserSettingsController",
        title: function () {
            return TAPi18n.__("User settings");
        },
        parent: "home"
    });
    Router.route("user_settings.profile", {
        path: "/user_settings/profile",
        controller: "UserSettingsProfileController",
        title: function () {
            return TAPi18n.__("Profile");
        },
        parent: "user_settings"
    });
    Router.route("user_settings.change_pass", {
        path: "/user_settings/change_pass",
        controller: "UserSettingsChangePassController",
        title: function () {
            return TAPi18n.__("Change password");
        },
        parent: "user_settings"
    });
    Router.route("user_settings.update_information", {
        path: "/user_settings/update_information",
        controller: "UserSettingsUpdateInformationController",
        title: function () {
            return TAPi18n.__("Update information");
        },
        parent: "user_settings",
        waitOn: function () {
            return [
                Meteor.subscribe('topics'),
                Meteor.subscribe('publications')
            ]
        }
    });
    Router.route("user_settings.my_favorite", {
        path: "/user_settings/my_favorite",
        controller: "UserSettingsMyFavoriteController",
        title: function () {
            return TAPi18n.__("My favorite");
        },
        parent: "user_settings",
        waitOn: function () {
            return [
                Meteor.subscribe('articleSearchResults')
            ]
        }
    });
    Router.route("user_settings.my_watch", {
        path: "/user_settings/my_watch",
        yieldTemplates: {
            'UserSettingsMyWatch': {to: 'UserSettingsSubcontent'}
        },
        parent: "user_settings",
        template: "UserSettings",
        title: function () {
            return TAPi18n.__("My alerts");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('publications'),
                Meteor.subscribe('topics')
            ]
        }
    });

    Router.route("user_settings.my_emails", {
        path: "/user_settings/my_emails",
        yieldTemplates: {
            'UserSettingsMyEmails': {to: 'UserSettingsSubcontent'}
        },
        parent: "user_settings",
        template: "UserSettings",
        title: function () {
            return TAPi18n.__("My emails");
        },
        waitOn: function () {
            return [
                //Meteor.subscribe('publications'),
                //Meteor.subscribe('topics')
            ]
        }
    });

    Router.route("user_settings.search_history", {
        path: "/user_settings/search_history",
        yieldTemplates: {
            'UserSettingsSearchHistory': {to: 'UserSettingsSubcontent'}
        },
        parent: "user_settings",
        template: "UserSettings",
        title: function () {
            return TAPi18n.__("Search History");
        },
        waitOn: function () {
            return [
//                Meteor.subscribe('publications'),
            ]
        }
    });

    Router.route("logout", {
        path: "/logout",
        controller: "LogoutController"
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
    Router.route('verifyEmail', {
        path: '/verify-email/:token',
        action: function () {
            Accounts.verifyEmail(this.params.token, function () {
                sweetAlert(TAPi18n.__("Email verified successfully"));
                Router.go('/');
            });
        }
    });
});