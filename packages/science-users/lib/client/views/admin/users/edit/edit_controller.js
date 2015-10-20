this.AdminUsersEditController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminUsersEdit': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		if (Router.current().route.getName() === "publisher.account.edit" && _.contains(Users.findOne({_id: this.params.userId}, {}).orbit_roles, "publisher:publisher-manager-from-user") && this.params.userId !== Meteor.userId())
			Router.go("home");
		Permissions.check("modify-user","publisher");
		/*BEFORE_FUNCTION*/
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("admin_user", this.params.userId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			admin_user: Users.findOne({_id:this.params.userId}, {})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
	}
});