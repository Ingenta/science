Meteor.methods({
    "createUserAccount": function (options) {
        var userId = Accounts.createUser(options);
        //send enrollment email
        //Accounts.sendEnrollmentEmail(userId);
        return userId;
    },
    "updateUserAccount": function (userId, options) {
        //// only admin or users own profile
        //if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
        //    throw new Meteor.Error(403, "Access denied.");
        //}
        //
        //// non-admin user can change only profile
        //if(!Users.isAdmin(Meteor.userId())) {
        //    var keys = Object.keys(options);
        //    if(keys.length !== 1 || !options.profile) {
        //        throw new Meteor.Error(403, "Access denied.");
        //    }
        //}

        var userOptions = {};
        if (options.username) userOptions.username = options.username;
        if (options.email) {
            var emails = Meteor.users.findOne({_id: userId}).emails;
            emails[0].address = options.email;
            userOptions.emails = emails;
        }
        if (options.password) userOptions.password = options.password;
        if (typeof(options.disable) !== "undefined") userOptions.disable = options.disable;
        if (options.profile) userOptions.profile = options.profile;

        var password = "";
        if (userOptions.password) {
            password = userOptions.password;
            delete userOptions.password;
        }

        if (options.journalId) {
            userOptions.journalId = options.journalId;
        }

        if (userOptions) {
            Users.update(userId, {$set: userOptions});
        }

        if (password) {
            Accounts.setPassword(userId, password);
        }
    }
});
