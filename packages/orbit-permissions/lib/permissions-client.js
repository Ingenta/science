var helpers = OrbitPermissionsHelpers;

if (Package.templating) {
	Package.templating.Template.registerHelper(globals.helper_name, function(permission, package_name, scope) {
		scope = (scope.journal || scope.publisher || scope.institution)?scope:undefined;
		return OrbitPermissions.userCan(permission, package_name, undefined, scope);
	});
}