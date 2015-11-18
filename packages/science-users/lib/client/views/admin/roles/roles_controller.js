this.AdminRolesController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminRoles': { to: 'AdminSubcontent'}

	},

	onBeforeAction: function() {
		Permissions.check("get-users-roles","permissions");
		/*BEFORE_FUNCTION*/
		this.next();
	},
	data: function() {


		return {
			params: this.params || {},
			admin_users: Users.find({}, {})
		};
		/*DATA_FUNCTION*/
	}
});
