this.AdminUsersController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminUsers': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		Permissions.check("list-user","user");
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {

		return true;
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