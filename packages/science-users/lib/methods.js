Meteor.methods({
    "createUserAccount": function (options,additional) {
        var userId = Accounts.createUser(options);
        if(userId){

        }
        Accounts.sendEnrollmentEmail(userId, options.email, function(err){
            if (err){
                logger.error("email didn't get sent");
            }
        });
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
        //增加用户级别设置
        if(options.level){
            userOptions.level = options.level;
        }

        if (userOptions) {
            Users.update(userId, {$set: userOptions});
        }

        if (password) {
            Accounts.setPassword(userId, password);
        }
    }
});
