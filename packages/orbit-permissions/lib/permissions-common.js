var Permissions, Roles, helpers, permissionsDep, rolesDep,
    indexOf = [].indexOf || function (item) {
		    for (var i = 0, l = this.length; i < l; i++) {
			    if (i in this && this[i] === item) return i;
		    }
		    return -1;
	    };

helpers = OrbitPermissionsHelpers;

Permissions = {};

permissionsDep = new Tracker.Dependency;

Roles = {};

rolesDep = new Tracker.Dependency;

OrbitPermissions = {
	custom_roles               : new Meteor.Collection(globals.custom_roles_collection_name),
	_reloadCustomRoles         : function () {
		var custom_roles;
		custom_roles = {};
		_.each(OrbitPermissions.custom_roles.find({}).fetch(), function (role) {
			return custom_roles[role._id] = {
				description: role.description,
				permissions: role.permissions
			};
		});
		Roles["project-custom"] = custom_roles;
		rolesDep.changed();
		return this;
	},
	defineCustomRole           : function (role_name, permissions, description, callback) {
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
				role                               = {
					_id        : role_name,
					permissions: permissions,
					description: description
				};
				Roles["project-custom"][role_name] = role;
				rolesDep.changed();
				this.custom_roles.insert(role, function (err, _id) {
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
	undefineCustomRole         : function (role_name, callback) {
		var role;
		if (!helpers.isDashSeparated(role_name)) {
			throw new Meteor.Error(403, "Role name should be all lowercase dash-separated");
		}
		role = Roles["project-custom"][role_name];
		delete Roles["project-custom"][role_name];
		rolesDep.changed();
		if (Meteor.isServer || this.throwIfUserCant("edit-custom-roles", "permissions")) {
			this.custom_roles.remove(role_name, function (err) {
				if (err != null) {
					Roles["project-custom"][role_name] = role;
					rolesDep.changed();
				}
				return callback(err);
			});
		}
		return this;
	},
	_modifyUsersRoles          : function (op, users, roles, callback) {
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
				update                                     = {
					$addToSet: {}
				};
				update.$addToSet[globals.roles_field_name] = {
					$each: roles
				};
			} else if (op === "revoke") {
				update                                    = {
					$pullAll: {}
				};
				update.$pullAll[globals.roles_field_name] = roles;
			}
			if (Meteor.isClient) {
				async.each(users, (function (user, callback) {
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
	_overrideUserRoles         : function (users, roles, callback) {
		var update;
		if (users == null) {
			throw new Meteor.Error(403, "Missing 'users' param");
		}
		if (roles == null) {
			throw new Meteor.Error(403, "Missing 'roles' param");
		}
		users = helpers.sterilizeUsersArray(users);
		roles = helpers.verifyRolesArray(helpers.sterilizeRolesArray(roles));
		var unionScope;
		if(Meteor.isClient){
			var allScope = _.pluck(roles,"scope");
			unionScope=_.reduce(allScope,function(mem,item){
				_.each(item,function(arr,key){
					if(!_.isEmpty(arr))
						mem[key]=mem[key]?_.union(mem[key],arr):arr
				})
				return mem;
			},{})
		}
		if (Meteor.isServer || this.throwIfUserCant("delegate-and-revoke", "permissions",unionScope)) {

			update                                = {
				$set: {}
			};
			update.$set[globals.roles_field_name] = roles;
			if (Meteor.isClient) {
				async.each(users, (function (user, callback) {
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
	delegate                   : function (users, roles, callback) {
		return this._modifyUsersRoles("delegate", users, roles, callback);
	},
	/**
	 * 设置用户角色(分派或收回均可)
	 * @param users
	 * @param roles
	 * @param callback
	 * @returns {*}
	 */
	setRoles                  : function (users, roles, callback) {
		return this._overrideUserRoles(users, roles, callback);
	},
	//收回用户的角色(由于用户角色已经重新定义,不应该继续使用该方法)
	revoke                     : function (users, roles, callback) {
		return this._modifyUsersRoles("revoke", users, roles, callback);
	},
	getUserRoles               : function (user) {
		var user_roles;
		if (Meteor.isClient) {
			if(!user)
				user = Meteor.user();
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
	userCan                    : function (permission, package_name, user, scope) {
		var i, len, message, ref, ref1, ref2, ref3, userRole, role_name, role_package;
		if (package_name == null) {
			message = "OrbitPermissions.UserCan(): You must specify package_name";
			logger.error("Error: " + message);
			throw new Meteor.Error(401, message);
		}
		rolesDep.depend();
		package_name = helpers.sterilizePackageName(package_name);

		ref = this.getUserRoles(user);



		var definedPermission = Permissions && Permissions[package_name] && Permissions[package_name][permission];
		//若权限定义中包含了一个鉴权方法,则调用该鉴权方法来判断用户是否具备某权限.
		if (definedPermission && definedPermission.options && _.isFunction(definedPermission.options.checkFunc)) {
			if(!user && Meteor.isClient)
				user = Meteor.userId();
			return definedPermission.options.checkFunc(user, scope);
		}
		if (!_.isEmpty(ref)) {
			//若用户拥有超级管理员权限,直接返回true
			if (_.find(ref, function (r) {
					return r === globals.admin_role;
				})) {
				return true;
			}
		}
		if (_.isEmpty(scope)) {
			// 遍历用户的所有角色
			for (i = 0, len = ref.length; i < len; i++) {
				userRole = ref[i];
				// 若权限是字符串类型,遍历用户的所有角色下的权限,若有任意一个权限名称与参数中的权限名称一致即认为用户具备该操作的权限.
				if (_.isString(userRole)) {
					ref1 = userRole.split(":"), role_package = ref1[0], role_name = ref1[1];
					if (((ref2 = Roles[role_package]) != null ? ref2[role_name] : void 0) != null) {
						if (ref3 = package_name + ":" + permission, indexOf.call(Roles[role_package][role_name].permissions, ref3) >= 0) {
							return true;
						}
					}
				} else if (_.isObject(userRole)) {
					// 用户信息中只包含了角色的名称和角色的适用范围,
					// 所以需要先查询得出详细的角色信息(角色包含哪些权限)
					ref1 = userRole.role.split(":"), role_package = ref1[0], role_name = ref1[1];
					var currDefineRole = Roles[role_package] && Roles[role_package][role_name];
					//检查用户是否具备目标权限
					if (indexOf.call(currDefineRole.permissions, package_name + ":" + permission) >= 0) {
						//如果未约束角色的有效范围,认为用户拥有该权限
						if (_.isEmpty(userRole.scope)) {
							return true;
						}
					}
				}
			}
		} else {
			//若自鉴权方法检查通过或权限定义中不包含鉴权方法(但约束了权限的有效范围),则使用以下的一般规则进行鉴权
			//即:待鉴权用户(user)的所有包含权限(package_name:permission)的角色的权限范围,是否能够完全的包含待检查的范围(scope)
			var fullScope = OrbitPermissions.getPermissionRange(user, package_name + ":" + permission);
			var flag      = true;
			_.each(scope, function (val, key) {
				val = _.isString(val)?[val]:val;
				var interSec = _.intersection(fullScope[key], val);
				if (_.isArray(val) && interSec.length < val.length)
					flag = false;
			})
			return flag;
		}
		return false;
	},
	throwIfUserCant            : function (permission, package_name, scope) {
		if (!this.userCan(permission, package_name,undefined, scope)) {
			throw new Meteor.Error(401, "Insufficient permissions: " + permission);
		}
		return true;
	},
	_loopPermissions           : function (cb) {
		var package_name, permission, results;
		if (!_.isFunction(cb)) {
			return;
		}
		if (Meteor.isClient) {
			permissionsDep.depend();
		}
		results = [];
		for (package_name in Permissions) {
			results.push((function () {
				var results1;
				results1 = [];
				for (permission in Permissions[package_name]) {
					var cbResult = cb(package_name, permission, Permissions[package_name][permission])
					cbResult && results1.push(cbResult);
				}
				return results1;
			})());
		}
		return results;
	},
	_loopPermissions2          : function (cb) {
		var package_name, permission, results;
		if (!_.isFunction(cb)) {
			return;
		}
		if (Meteor.isClient) {
			permissionsDep.depend();
		}
		results = [];
		for (package_name in Permissions) {

			var results1;
			results1 = [];
			for (permission in Permissions[package_name]) {
				var cbResult = cb(package_name, permission, Permissions[package_name][permission])
				cbResult && results1.push({name: package_name + ":" + permission, description: cbResult});
			}
			if (!_.isEmpty(results1)) {
				results.push({name: package_name, permissions: results1})
			}

		}
		return results;
	},
	_loopRoles                 : function (cb) {
		var package_name, permissions, results, role_data, role_name;
		if (!_.isFunction(cb)) {
			return;
		}
		if (Meteor.isClient) {
			rolesDep.depend();
		}
		results = [];
		for (package_name in Roles) {
			results.push((function () {
				var results1;
				results1 = [];
				for (role_name in Roles[package_name]) {
					role_data    = Roles[package_name][role_name];
					permissions  = role_data.permissions.slice();
					var cbResult = cb(package_name, role_name, permissions, role_data.description)
					cbResult && results1.push(cbResult);
				}
				return results1;
			})());
		}
		return results;
	},
	getPermissions             : function () {
		var permissions;
		permissions = [];
		this._loopPermissions(function (package_name, permission_name, permission_description) {
			return permissions.push(package_name + ":" + permission_name);
		});
		return permissions;
	},
	getRoles                   : function () {
		var roles;
		roles = {};
		this._loopRoles(function (package_name, role_name, role_permissions, role_description) {
			return roles[package_name + ":" + role_name] = role_permissions;
		});
		return roles;
	},
	isAdmin                    : function (user) {
		var ref;
		return ref = globals.admin_role, indexOf.call(this.getUserRoles(user), ref) >= 0;
	},
	addAdmins                  : function (users, callback) {
		return this.delegate(users, globals.admin_role, callback);
	},
	removeAdmins               : function (users, callback) {
		return this.revoke(users, globals.admin_role, callback);
	},
	getPermissionsDescriptions : function (level) {
		var fallback_language, language, permissions;
		language          = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		permissions       = {};
		this._loopPermissions(function (package_name, permission_name, permission_description) {
			var description;
			description = permission_description[fallback_language];

			if (language in permission_description) {
				description = permission_description[language];
			}
			if (permission_description.options) {
				description.options = permission_description.options
				if (!_.isEmpty(level) && _.isEmpty(_.intersection(description.options.level, level)))
					return;
			}

			return permissions[package_name + ":" + permission_name] = description;
		});
		return permissions;
	},
	getPermissionsDescriptions2: function (level) {
		var fallback_language, language, permissions;
		language          = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		permissions       = this._loopPermissions2(function (package_name, permission_name, permission_description) {
			var description;
			description = permission_description[fallback_language];

			if (language in permission_description) {
				description = permission_description[language];
			}
			if (permission_description.options) {
				description.options = permission_description.options
				if (!_.isEmpty(level) && _.isEmpty(_.intersection(description.options.level, level)))
					return;
			}

			return description;
		});
		return permissions;
	},
	getRolesDescriptions       : function (level) {
		var fallback_language, language, roles;
		language          = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		roles             = {};
		this._loopRoles(function (package_name, role_name, role_permissions, role_description) {
			var description;
			description = role_description[fallback_language];
			if (language in role_description) {
				description = role_description[language];
			}
			description.options = role_description.options;
			if (!_.isEmpty(level) && _.isEmpty(_.intersection(description.options.level, level)))
				return;
			return roles[package_name + ":" + role_name] = description;
		});
		return roles;
	},
	getRolesDescriptions2      : function (level, needPkgLevel) {
		if(typeof level === 'string')
			level= [level];
		var fallback_language, language, roles;
		language          = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		roles             = [];
		_.each(Roles, function (pkg_roles, pkg_name) {
			var roles1 = [];
			_.each(pkg_roles, function (role, role_name) {
				if (_.isEmpty(level) || !_.isEmpty(_.intersection(role.description.options.level, level))) {
					var role1                 = {};
					role1.description         = role.description[language] || role.description[fallback_language];
					role1.description.options = role.description.options;
					role1.permissions         = role.permissions;
					role1.name                = pkg_name + ":" + role_name;
					roles1.push(role1);
				}
			})
			if(!_.isEmpty(roles1)){
				if(needPkgLevel){
					roles.push({pkg: pkg_name, roles: roles1})
				}else{
					roles=roles.concat(roles1)
				}
			}
		});
		return roles;
	},
	getPermissionRange         : function (userId, permission) {
		if(!userId && Meteor.isClient)
			userId = Meteor.userId();
		var user = helpers.getUserObject(userId);
		if (user == null) {
			return [];
		}
		var userRoles = user[globals.roles_field_name];
		if (!_.isArray(userRoles)) {
			userRoles = [];
		}

		if (_.isEmpty(userRoles)) {
			return;
		}
		var definedRoles = [];
		_.each(Roles, function (roles, pkgName) {
			_.each(roles,function(roleDef,roleName){
				if (roleDef && !_.isEmpty(roleDef.permissions)) {
					if (_.contains(roleDef.permissions, permission)) {
						var obj  = _.clone(roleDef);
						obj.role = pkgName + ":" + roleName;
						definedRoles.push(obj);
					}
				}
			})
		});
		var filterUserRoles = [];
		_.each(userRoles, function (ur) {
			var urkey = _.isObject(ur) ? ur.role : ur;
			if (_.find(definedRoles, function (dr) {
					return dr.role === urkey;
				}))
				filterUserRoles.push(ur);
		})
		return _.reduce(_.pluck(filterUserRoles, 'scope'), function (memo, obj) {
			_.each(obj, function (val, key) {
				if (!_.isEmpty(val))
					memo[key] = memo[key] ? _.union(val, memo[key]) : val
			})
			return memo;
		}, {})
	}
};

OrbitPermissions.Registrar = function (package_name) {
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
	package_roles         = Roles[package_name];
	this.definePermission = function (permission_name, description) {
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
	this.defineRole       = function (role_name, permissions, description) {
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
		permissions              = permissions.slice();
		permissions              = _.reduce(permissions, (function (memo, permission) {
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
	added  : (function () {
		return OrbitPermissions._reloadCustomRoles();
	}),
	changed: (function () {
		return OrbitPermissions._reloadCustomRoles();
	}),
	removed: (function () {
		return OrbitPermissions._reloadCustomRoles();
	})
});

(new OrbitPermissions.Registrar("permissions"))
	.definePermission("edit-custom-roles", {
		cn     : {name: "编辑自定义角色", summary: "可编辑自定义角色的权限"},
		en: {name: "can modify custom roles", summary: "can modify custom roles"},
		options: {level: ["admin"]}
	})
	.definePermission("get-users-roles", {
		cn     : {name: "查看用户角色信息", summary: "可查看用户角色信息"},
		en: {name: "get users roles", summary: "get users roles"},
		options: {level: ["admin"]}
	})
	.definePermission("delegate-and-revoke", {
		cn     : {name: "角色委派与收回", summary: "可设置和取消用户的角色"},
		en: {name: "delefate and revoke user's role", summary: "delefate and revoke user's role"},
		options: {level: ["admin","publisher"]}
	})
	.defineRole("permissions-manager", ["edit-custom-roles", "get-users-roles", "delegate-and-revoke"], {
		cn     : {name: "权限管理员", summary: "可以编辑自定义角色,可为用户设置平台角色"},
		en: {name: "permissions manager", summary: "permissions manager"},
		options: {level: ["admin"]}
	})
	.defineRole("admin", [], {
		cn     : {name: "超级管理员", summary: "拥有所有平台权限"},
		en: {name: "Super admin", summary: "have all permissions"},
		options: {level: ["admin"]}
	});
