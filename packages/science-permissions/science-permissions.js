Permissions = OrbitPermissions;

Permissions.custom_roles.allow({
    update: function (userId, doc) {
        return OrbitPermissions.userCan("edit-custom-roles",
            "permissions", userId);
    }
});

_.extend(Permissions, {
    isNameExists: function (name) {
        name = space2dash(name);
        var customs = Permissions.getCustomRoles();
        return !!_.findWhere(customs, {shortName: name});
    },
    space2dash: function (str) {
        str = str.trim();
        return str.replace(/\s+/g, '-').toLowerCase();
    },
    getPermissionsByCode: function (code) {
        return Permissions.getPermissionsDescriptions()[code];
    },
    getRoleDescByCode: function (code) {
        return Permissions.getRolesDescriptions()[code];
    },
    check: function (perm, pkg) {
        if (Meteor.user() && Meteor.user().disable) {
            console.log("account disabled");
            Meteor.logout();
            Router.go("home");
            return;
        }
        if (!Meteor.user()) {
            console.log("hasn't login");
            Router.go("login");
            return;
        }
        if (perm && pkg)
            Permissions.throwIfUserCant(perm, pkg);
    },
    undefineCustomRoleAndRevoke: function (role, callback) {
        try {
            Meteor.call("batchRevoke", "project-custom:" + role, function (err, result) {
                if (err) {
                    throw err;
                }
                Permissions.undefineCustomRole(role, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            });
        } catch (e) {
            if (callback)
                callback(e);
        }

    }
});

if (Meteor.isClient) {
    _.extend(Permissions, {
        getCustomRoles2: function (id) {  // better way
            if (id) {
                return Permissions.custom_roles.findOne({_id: id});
            }
            return Permissions.custom_roles.find();
        },
        updateRolesPermissions: function (roleName, perms) {
            try {
                Permissions.custom_roles.update({_id: roleName}, {$set: {permissions: perms}});
                return true;
            } catch (e) {
                throw e;
            }
        }
    })
}

Meteor.startup(function () {
    if (Meteor.isServer && Config && Config.defaultAdmin) {
        var da = _.clone(Config.defaultAdmin);
        _.extend(da, {
            profile: {
                name: da.username
            }
        });
        var queryArr = [];
        queryArr.push({'emails.address': da.email});
        queryArr.push({'username': da.username});
        if (!Users.findOne({$or: queryArr})) {
            logger.warn("create default user '" + da.username + "'");
            var userId = Accounts.createUser(da)
            logger.warn("set admin role for user '" + da.username + "'");
            Permissions.delegate(userId, ["permissions:admin"]);
        }
    }
});