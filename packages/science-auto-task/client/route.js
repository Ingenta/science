Router.route("admin.autotask", {
	path: "/admin/autotask",
	title: function () {
		return "AutoTask"
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