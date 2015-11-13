var helpers = OrbitPermissionsHelpers;

if (Package.templating) {
	Package.templating.Template.registerHelper(globals.helper_name, function(permission, package_name) {
		return OrbitPermissions.userCan(permission, package_name);
	});
}

_.extend(OrbitPermissions, {
	getPermissionsDescriptions: function() {
		var fallback_language, language, permissions;
		language = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		permissions = {};
		this._loopPermissions(function(package_name, permission_name, permission_description) {
			var description;
			description = permission_description[fallback_language];
			if (language in permission_description) {
				description = permission_description[language];
			}
			return permissions[package_name + ":" + permission_name] = description;
		});
		return permissions;
	},
	getRolesDescriptions: function() {
		var fallback_language, language, roles;
		language = helpers.getLanguage();
		fallback_language = helpers.getFallbackLanguage();
		roles = {};
		this._loopRoles(function(package_name, role_name, role_permissions, role_description) {
			var description;
			description = role_description[fallback_language];
			if (language in role_description) {
				description = role_description[language];
			}
			return roles[package_name + ":" + role_name] = description;
		});
		return roles;
	}
});