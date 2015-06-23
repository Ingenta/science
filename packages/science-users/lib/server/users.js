

Accounts.onCreateUser(function (options, user) {
    user.roles = ["admin"];

    if(options.profile) {
        user.profile = options.profile;
    }



    return user;
});

Accounts.validateLoginAttempt(function(info) {

    // reject users with role "blocked"
    if(info.user && Users.isInRole(info.user._id, "blocked")) {
        throw new Meteor.Error(403, "Your account is blocked.");
    }

    return true;
});


Users.before.insert(function(userId, doc) {
    if(doc.emails && doc.emails[0] && doc.emails[0].address) {
        doc.profile = doc.profile || {};
        doc.profile.email = doc.emails[0].address;
    }
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
    if(modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
        modifier.$set.profile.email = modifier.$set.emails[0].address;
    }
});

Accounts.onLogin(function (info) {

});

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset_password/' + token);
};
