Router.route("/admin/institutions/", {
	template      : "Admin",
	name          : "admin.institutions",
	parent        : "admin",
	yieldTemplates: {
		'AdminInstitution': { to: 'AdminSubcontent'}
	},
	title         : function () {
		return TAPi18n.__("Institution");
	},
	waitOn        : function () {
		return [
			//Meteor.subscribe('institutions')
		]
	}
});