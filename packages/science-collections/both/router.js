Router.route("collections", {
	template:"collections",
	parent: "home",
	title: function () {
		return TAPi18n.__("Collections");
	}
});