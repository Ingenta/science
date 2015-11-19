this.AdminUsersEditController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminUsersEdit': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		if (Router.current().route.getName() === "publisher.account.edit" && _.contains(Users.findOne({_id: this.params.userId}, {}).orbit_roles, "publisher:publisher-manager-from-user") && this.params.userId !== Meteor.userId())
			Router.go("home");
		Permissions.check("modify-user","user");
		/*BEFORE_FUNCTION*/
		this.next();
	},

	data: function() {
		return {
			params: this.params || {},
			currUser: Users.findOne({_id:this.params.userId}, {})
		};
		/*DATA_FUNCTION*/
	}
});