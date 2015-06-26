Meteor.methods({
    "createUserAccount": function(options) {
        if(!Users.isAdmin(Meteor.userId())) {
            throw new Meteor.Error(403, "Access denied.");
        }

        var userOptions = {};
        if(options.username) userOptions.username = options.username;
        if(options.email) userOptions.email = options.email;
        if(options.password) userOptions.password = options.password;
        if(options.profile) userOptions.profile = options.profile;
        if(options.profile && options.profile.email) userOptions.email = options.profile.email;

        Accounts.createUser(userOptions);
    },
    "updateUserAccount": function(userId, options) {
        // only admin or users own profile
        if(!(Users.isAdmin(Meteor.userId()) || userId == Meteor.userId())) {
            throw new Meteor.Error(403, "Access denied.");
        }

        // non-admin user can change only profile
        if(!Users.isAdmin(Meteor.userId())) {
            var keys = Object.keys(options);
            if(keys.length !== 1 || !options.profile) {
                throw new Meteor.Error(403, "Access denied.");
            }
        }

        var userOptions = {};
        if(options.username) userOptions.username = options.username;
        if(options.email) userOptions.email = options.email;
        if(options.password) userOptions.password = options.password;
        if(options.profile) userOptions.profile = options.profile;

        if(options.profile && options.profile.email) userOptions.email = options.profile.email;
        if(options.roles) userOptions.roles = options.roles;

        if(userOptions.email) {
            var email = userOptions.email;
            delete userOptions.email;
            userOptions.emails = [{ address: email }];
        }

        var password = "";
        if(userOptions.password) {
            password = userOptions.password;
            delete userOptions.password;
        }

        if(userOptions) {
            Users.update(userId, { $set: userOptions });
        }

        if(password) {
            Accounts.setPassword(userId, password);
        }
    },
    "createRole":function(role){
        check(role,Match.ObjectIncluding({name: String}));
        if(Meteor.isServer)
          return Roles.createRole(role);
        return null;
    },
    "updateRole":function(id,role){
        check(id,String);
        check(role,Match.ObjectIncluding({name: String}));
        if(Meteor.isServer)
            return Roles.updateRole(id,role);
        return false;
    }
});
