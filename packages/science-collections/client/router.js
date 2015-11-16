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
        Session.set('otherLetter', undefined);
		Session.set('PerPage', 10);
        Session.set('journalId', undefined);
        Session.set('currentJournalId', undefined);
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
			Meteor.subscribe('articleSearchResults')
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
			Meteor.subscribe('articleSearchResults')
		]
	}
});

