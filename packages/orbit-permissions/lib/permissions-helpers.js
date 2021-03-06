OrbitPermissionsHelpers = {
	dashToWhiteSpace: function(s) {
		return s.replace(/-/g, " ");
	},
	isDashSeparated: function(s) {
		return /^[a-z0-9][a-z0-9\-]*$/.test(s);
	},
	sterilizePackageName: function(name) {
		if (!_.isString(name)) {
			name = "";
		}
		return name.replace(/^.+:/, "");
	},
	sterilizeInputDescription: function(input_description, symbol_name) {
		var default_description, description, fb_lang;
		default_description = {};
		fb_lang = globals.fallback_language;
		default_description[fb_lang] = {
			name: OrbitPermissionsHelpers.ucfirst(OrbitPermissionsHelpers.dashToWhiteSpace(symbol_name))
		};
		if (!_.isObject(input_description)) {
			description = default_description;
		} else if (input_description[fb_lang] == null) {
			description = _.extend({}, input_description, default_description);
		} else {
			description = input_description;
		}
		return description;
	},
	getUserObject: function(user) {
		if (_.isString(user)) {
			return Meteor.users.findOne({
				_id: user
			});
		} else if (_.isObject(user)) {
			return Meteor.users.findOne({
				_id: user._id
			});
		} else {
			return void 0;
		}
	},
	getUserId: function(user) {
		if (_.isString(user)) {
			return user;
		} else if (_.isObject(user)) {
			if (_.isString(user._id)) {
				return user._id;
			}
		} else {
			return void 0;
		}
	},
	sterilizeUsersArray: function(users) {
		if (!_.isArray(users)) {
			users = [users];
		}
		return _.reduce(users, (function(memo, user) {
			var uid;
			if ((uid = OrbitPermissionsHelpers.getUserId(user)) != null) {
				memo.push(uid);
			}
			return memo;
		}), []);
	},
	isValidOrbitPermissionsSymbol: function(role) {
		var roleName = _.isObject(role)?role.role:role;
		return /^[a-z0-9][a-z0-9\-]*:[a-z0-9][a-z0-9\-]*$/.test(roleName);
	},
	verifyRolesArray: function(roles) {
		var i, len, role;
		for (i = 0, len = roles.length; i < len; i++) {
			role = roles[i];
			if (!this.isValidOrbitPermissionsSymbol(role)) {
				throw new Meteor.Error(403, "Invalid role name: `" + role + "'");
			}
		}
		return roles;
	},
	sterilizeRolesArray: function(roles) {
		if (_.isString(roles)) {
			roles = [roles];
		}
		return roles;
	},
	getFallbackLanguage: function() {
		return globals.fallback_language;
	},
	getLanguage: function() {
		var language, tap_lang;
		language = this.getFallbackLanguage();
		if (Meteor.isServer) {
			return language;
		}
		if (Package["tap:i18n"]) {
			tap_lang = Package["tap:i18n"].TAPi18n.getLanguage();
			if (tap_lang) {
				language = tap_lang;
			}
		}
		return language;
	},
	ucfirst: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	mergeRanges: function(){
		return _.reduce(arguments,function(memo,obj){
			_.each(obj,function(val,key) {
				val = _.isArray(val)?val:(val?[val]:[]);
				if (!_.isEmpty(val))
					memo[key] = memo[key] ? _.union(val, memo[key]) : val;
			})
			return memo;
		},{})
	}
};