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

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},
	data: function() {


		return {
			params: this.params || {},
			admin_users: Users.find({}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});
