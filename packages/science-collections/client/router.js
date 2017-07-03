Router.route("/collections/", {
	template      : "collections",
	name          : "collections",
	parent        : "home",
	title         : function () {
		return TAPi18n.__("Collections");
	},
	waitOn        : function () {
		return [
			CollectionSubs.subscribe('allCollections'),
			HomePageSubs.subscribe('HomeAdvertisementShowPage'),
			HomePageSubs.subscribe('homePromoteImage'),
			Meteor.subscribe('collectionsImage'),
			HomePageSubs.subscribe('publishers')
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
			CollectionSubs.subscribe('allCollections'),
			Meteor.subscribe('collectionsImage'),
			Meteor.subscribe('articlesInCollection',this.params.collId)
		]
	},
	onStop : function(){
		Science.dom.clearSelect2Record()
	},
	data:function(){
		return {collInfo:ArticleCollections.findOne({_id: this.params.collId})};
	}
});


