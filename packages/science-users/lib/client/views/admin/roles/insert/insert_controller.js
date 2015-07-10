this.AdminRolesInsertController = RouteController.extend({
	template: "Admin",


	yieldTemplates: {
		'AdminRolesInsert': { to: 'AdminSubcontent'}

	},

	onBeforeAction: function() {
		Permissions.check("edit-custom-roles","permissions");
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {


		var subs = [
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {

	},

	onAfterAction: function() {
	}
});
