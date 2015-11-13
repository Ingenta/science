var Permissions, Roles, helpers, permissionsDep, rolesDep,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

helpers = OrbitPermissionsHelpers;

Permissions = {};

permissionsDep = new Tracker.Dependency;

Roles = {};

rolesDep = new Tracker.Dependency;

OrbitPermissions = {
	custom_roles: new Meteor.Collection(globals.custom_roles_collection_name),
	_reloadCustomRoles: function() {
		var custom_roles;
		custom_roles = {};
		_.each(OrbitPermissions.custom_roles.find({}).fetch(), function(role) {
			return custom_roles[role._id] = {
				description: role.description,
				permissions: role.permissions
			};
		});
		Roles["project-custom"] = custom_roles;
		rolesDep.changed();
		return this;
	},
	defineCustomRole: function(role_name, permissions, description, callback) {
		var role;
		if (description == null) {
			description = {};
		}
		if (!helpers.isDashSeparated(role_name)) {
			throw new Meteor.Error(403, "Role name should be all lowercase dash-separated");
		}
		description = helpers.sterilizeInputDescription(description, role_name);
		if (Meteor.isServer || this.throwIfUserCant("edit-custom-roles", "permissions")) {
			if (Roles["project-custom"][role_name] == null) {
				role = {
					_id: role_name,
					permissions: permissions,
					description: description
				};
				Roles["project-custom"][role_name] = role;
				rolesDep.changed();
				this.custom_roles.insert(role, function(err, _id) {
					if (err != null) {
						delete Roles["project-custom"][role_name];
						rolesDep.changed();
					}
					return callback(err, _id);
				});
			} else {
				throw new Meteor.Error(400, "Project role `" + role_name + "' is already defined");
			}
		}
		return this;
	},
	undefineCustomRole: function(role_name, callback) {
		var role;
		if (!helpers.isDashSeparated(role_name)) {
			throw new Meteor.Error(403, "Role name should be all lowercase dash-separated");
		}
		role = Roles["project-custom"][role_name];
		delete Roles["project-custom"][role_name];
		rolesDep.changed();
		if (Meteor.isServer || this.throwIfUserCant("edit-custom-roles", "permissions")) {
			this.custom_roles.remove(role_name, function(err) {
				if (err != null) {
					Roles["project-custom"][role_name] = role;
					rolesDep.changed();
				}
				return callback(err);
			});
		}
		return this;
	},
	_modifyUsersRoles: function(op, users, roles, callback) {
		var update;
		if (op !== "delegate" && op !== "revoke") {
			throw new Meteor.Error(403, "Unknow operation");
		}
		if (users == null) {
			throw new Meteor.Error(403, "Missing 'users' param");
		}
		if (roles == null) {
			throw new Meteor.Error(403, "Missing 'roles' param");
		}
		users = helpers.sterilizeUsersArray(users);
		roles = helpers.verifyRolesArray(helpers.sterilizeRolesArray(roles));
		if (Meteor.isServer || this.throwIfUserCant("delegate-and-revoke", "permissions")) {
			if (op === "delegate") {
				update = {
					$addToSet: {}
				};
				update.$addToSet[globals.roles_field_name] = {
					$each: roles
				};
			} else if (op === "revoke") {
				update = {
					$pullAll: {}
				};
				update.$pullAll[globals.roles_field_name] = roles;
			}
			if (Meteor.isClient) {
				async.each(users, (function(user, callback) {
					return Meteor.users.update({
						_id: user
					}, update, callback);
				}), callback);
			} else {
				Meteor.users.update({
					_id: {
						$in: users
					}
				}, update, {
					multi: true
				}, callback);
			}
		}
		return this;
	},
	delegate: function(users, roles, callback) {
		return this._modifyUsersRoles("delegate", users, roles, callback);
	},
	revoke: function(users, roles, callback) {
		return this._modifyUsersRoles("revoke", users, roles, callback);
	},
	getUserRoles: function(user) {
		var user_roles;
		if (Meteor.isClient) {
			if (user != null) {
				if (!this.userCan("get-users-roles", "permissions")) {
					throw new Meteor.Error(401, "Can't query permissions of other users");
				}
			} else {
				user = Meteor.user();
			}
		}
		if (user == null) {
			return [];
		}
		user = helpers.getUserObject(user);
		if (user == null) {
			return [];
		}
		user_roles = user[globals.roles_field_name];
		if (!_.isArray(user_roles)) {
			user_roles = [];
		}
		return user_roles;
	},
	userCan: function(permission, package_name, user) {
		var i, len, message, ref, ref1, ref2, ref3, role, role_name, role_package;
		if (package_name == null) {
			message = "OrbitPermissions.UserCan(): You must specify package_name";
			console.log("Error: " + message);
			throw new Meteor.Error(401, message);
		}
		rolesDep.depend();
		package_name = helpers.sterilizePackageName(package_name);
		ref = this.getUserRoles(user);
		for (i = 0, len = ref.length; i < len; i++) {
			role = ref[i];
			if (role === globals.admin_role) {
				return true;
			}
			ref1 = role.split(":"), role_package = ref1[0], role_name = ref1[1];
			if (((ref2 = Roles[role_package]) != null ? ref2[role_name] : void 0) != null) {
				if (ref3 = package_name + ":" + permission, indexOf.call(Roles[role_package][role_name].permissions, ref3) >= 0) {
					return true;
				}
			}
		}
		return false;
	},
	throwIfUserCant: function(permission, package_name, user) {
		if (!this.userCan(permission, package_name, user)) {
			throw new Meteor.Error(401, "Insufficient permissions");
		}
		return true;
	},
	_loopPermissions: function(cb) {
		var package_name, permission, results;
		if (!_.isFunction(cb)) {
			return;
		}
		if (Meteor.isClient) {
			permissionsDep.depend();
		}
		results = [];
		for (package_name in Permissions) {
			results.push((function() {
				var results1;
				results1 = [];
				for (permission in Permissions[package_name]) {
					results1.push(cb(package_name, permission, Permissions[package_name][permission]));
				}
				return results1;
			})());
		}
		return results;
	},
	_loopRoles: function(cb) {
		var package_name, permissions, results, role_data, role_name;
		if (!_.isFunction(cb)) {
			return;
		}
		if (Meteor.isClient) {
			rolesDep.depend();
		}
		results = [];
		for (package_name in Roles) {
			results.push((function() {
				var results1;
				results1 = [];
				for (role_name in Roles[package_name]) {
					role_data = Roles[package_name][role_name];
					permissions = role_data.permissions.slice();
					results1.push(cb(package_name, role_name, permissions, role_data.description));
				}
				return results1;
			})());
		}
		return results;
	},
	getPermissions: function() {
		var permissions;
		permissions = [];
		this._loopPermissions(function(package_name, permission_name, permission_description) {
			return permissions.push(package_name + ":" + permission_name);
		});
		return permissions;
	},
	getRoles: function() {
		var roles;
		roles = {};
		this._loopRoles(function(package_name, role_name, role_permissions, role_description) {
			return roles[package_name + ":" + role_name] = role_permissions;
		});
		return roles;
	},
	isAdmin: function(user) {
		var ref;
		return ref = globals.admin_role, indexOf.call(this.getUserRoles(user), ref) >= 0;
	},
	addAdmins: function(users, callback) {
		return this.delegate(users, globals.admin_role, callback);
	},
	removeAdmins: function(users, callback) {
		return this.revoke(users, globals.admin_role, callback);
	}
};

OrbitPermissions.Registrar = function(package_name) {
	var package_permissions, package_roles;
	if (package_name == null) {
		package_name = "project";
	}
	package_name = helpers.sterilizePackageName(package_name);
	if (!Permissions[package_name]) {
		Permissions[package_name] = {};
	}
	package_permissions = Permissions[package_name];
	if (!Roles[package_name]) {
		Roles[package_name] = {};
	}
	package_roles = Roles[package_name];
	this.definePermission = function(permission_name, description) {
		if (!helpers.isDashSeparated(permission_name)) {
			throw new Meteor.Error(403, "Permission name should be all lowercase dash-separated");
		}
		if (permission_name in package_permissions) {
			if (_.isObject(description)) {
				description = _.extend({}, package_permissions[permission_name], description);
			} else {
				return this;
			}
		}
		package_permissions[permission_name] = helpers.sterilizeInputDescription(description, permission_name);
		permissionsDep.changed();
		return this;
	};
	this.defineRole = function(role_name, permissions, description) {
		if (permissions == null) {
			permissions = null;
		}
		if (!helpers.isDashSeparated(role_name)) {
			throw new Meteor.Error(403, "Role name should be all lowercase dash-separated");
		}
		if (role_name in package_roles) {
			if (permissions != null) {
				throw new Meteor.Error(403, "For security reasons package role's permissions can't be changed.");
			}
			if (_.isObject(description)) {
				package_roles[role_name].description = _.extend({}, package_roles[role_name].description, description);
				rolesDep.changed();
			}
			return this;
		}
		if (!_.isArray(permissions)) {
			throw new Meteor.Error(403, "When defining a new role, permissions must be an array");
		}
		permissions = permissions.slice();
		permissions = _.reduce(permissions, (function(memo, permission) {
			if (helpers.isValidOrbitPermissionsSymbol(permission)) {
				memo.push(permission);
			} else if (helpers.isDashSeparated(permission)) {
				memo.push(package_name + ":" + permission);
			} else {
				throw new Meteor.Error(403, "OrbitPermissions.defineRole called with an invalid permission: `" + permission + "'. Permissions should be prefixed with their package name or be part of the current package.");
			}
			return memo;
		}), []);
		package_roles[role_name] = {
			description: helpers.sterilizeInputDescription(description, role_name),
			permissions: permissions
		};
		rolesDep.changed();
		return this;
	};
	return this;
};

OrbitPermissions._reloadCustomRoles();

OrbitPermissions.custom_roles.find({}).observe({
	added: (function() {
		return OrbitPermissions._reloadCustomRoles();
	}),
	changed: (function() {
		return OrbitPermissions._reloadCustomRoles();
	}),
	removed: (function() {
		return OrbitPermissions._reloadCustomRoles();
	})
});

(new OrbitPermissions.Registrar("permissions")).definePermission("edit-custom-roles").definePermission("get-users-roles").definePermission("delegate-and-revoke").defineRole("permissions-manager", ["edit-custom-roles", "get-users-roles", "delegate-and-revoke"]).defineRole("admin", []);