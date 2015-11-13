var helpers = OrbitPermissionsHelpers;

if (Package.templating) {
	Package.templating.Template.registerHelper(globals.helper_name, function(permission, package_name) {
		return OrbitPermissions.userCan(permission, package_name);
	});
}

_.extend(OrbitPermissions, {

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