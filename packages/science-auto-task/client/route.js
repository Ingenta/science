Router.route("admin.autotask", {
	path: "/admin/autotask",
	title: function () {
		return TAPi18n.__("AutoTask");
	},
	parent: "admin",
	template: "Admin",
	yieldTemplates: {
		'autoTask': {to: 'AdminSubcontent'}
	},
	waitOn:function () {
		return [
			Meteor.subscribe('autoTasks')
		]
	}
});