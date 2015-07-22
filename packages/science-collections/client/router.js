Router.route("/collections/", {
	template      : "collections",
	name          : "collections",
	parent        : "home",
	title         : function () {
		return TAPi18n.__("Collections");
	},
	waitOn        : function () {
		return [
			Meteor.subscribe('allCollections'),
			Meteor.subscribe('images'),
			Meteor.subscribe('publishers')
		]
	},
	onBeforeAction: function () {
		Session.set('filterPublisher', undefined);
		Session.set('firstLetter', undefined);
		Session.set('PerPage', 10);
		this.next();
	}
});

Router.route("/collections/:collId/", {
	template      : "collDetail",
	name          : "collections.detail",
	parent        : "collections",
	title         : function () {
		return TAPi18n.__("collectionDetail");
	},
	waitOn        : function () {
		return [
			Meteor.subscribe('allCollections'),
			Meteor.subscribe('articles'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('publishers')
		]
	}
});

Router.route("/collections/:collId/articles/", {
	template      : "addArticleForCollection",
	name          : "collections.selectArticles",
	parent        : "collections",
	title         : function () {
		return TAPi18n.__("addArticleToCollection");
	},
	waitOn        : function () {
		return [
			Meteor.subscribe('allCollections'),
			Meteor.subscribe('articles'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('publishers')
		]
	}
});

