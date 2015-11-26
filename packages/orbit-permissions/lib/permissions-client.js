var helpers = OrbitPermissionsHelpers;

if (Package.templating) {
	Package.templating.Template.registerHelper(globals.helper_name, function(permission, package_name, scope) {
		return OrbitPermissions.userCan(permission, package_name, undefined, scope);
	});
}