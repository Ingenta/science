Router.route("admin.upload", {
	path: "/admin/upload",
	title: function () {
		return TAPi18n.__("Upload");
	},
	parent: "admin",
	template:"Admin",
	yieldTemplates: {
		'AdminUpload': { to: 'AdminSubcontent'}
	}
});