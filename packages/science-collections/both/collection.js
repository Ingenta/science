this.ArticleCollections = new Meteor.Collection("articleCollections");

ArticleCollections.allow({
	insert: function (userId, doc) {
		return Permissions.userCan("add-publisher-collection", "collections", userId);
	},
	update: function (userId, doc) {
		return Permissions.userCan("modify-publisher-collection", "collections", userId);
	},
	remove: function(userId,doc){
		return Permissions.userCan("delete-publisher-collection", "collections", userId);
	}
});

ArticleCollectionsSchema = new SimpleSchema({
	title: {
		type: String,
		unique: true
	},
	chinesetitle:{
		type: String
	},
	description:{
		type: String
	},
	chinesedescription: {
		type: String
	}
});
Meteor.startup(function () {
	ArticleCollectionsSchema.i18n("schemas.collections");
	ArticleCollections.attachSchema(ArticleCollectionsSchema);
});
