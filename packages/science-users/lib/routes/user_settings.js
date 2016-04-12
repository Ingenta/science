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
            HomePageSubs.subscribe('topics'),
            HomePageSubs.subscribe('publications')
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
            Meteor.subscribe('myFavouriteArticles')
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
            HomePageSubs.subscribe('publications'),
            HomePageSubs.subscribe('topics'),
            Meteor.subscribe('myWatchedArticles')
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
    }
});