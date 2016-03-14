Meteor.startup(function () {
    Router.route("login", {
        parent: "home",
        path: "/login",
        controller: "LoginController",
        title: function () {
            return TAPi18n.__("Login");
        }
    });

    Router.route("logout", {
        path: "/logout",
        controller: "LogoutController"
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

    Router.route('verifyEmail', {
        path: '/verify-email/:token',
        action: function () {
            Accounts.verifyEmail(this.params.token, function () {
                sweetAlert(TAPi18n.__("Email verified successfully"));
                Router.go('/user_settings/update_information');
            });
        }
    });
});