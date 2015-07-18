Router.route("collections", {
	template:"collections",
	parent: "home",
	title: function () {
		return TAPi18n.__("Collections");
	},
	waitOn: function () {
		return [
			Meteor.subscribe('allCollections'),
			Meteor.subscribe('images'),
			Meteor.subscribe('publishers')
		]
	},
	onBeforeAction:function(){
		Session.set('filterPublisher', undefined);
		Session.set('firstLetter', undefined);
		Session.set('PerPage', 10);
		this.next();
	}
});