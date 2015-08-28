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
		type: Science.schemas.MultiLangSchema
	},
	description:{
		type: Science.schemas.MultipleAreaSchema
	},
	picture: {
		type: String,
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'fileUpload',
				collection: 'Images',
				accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
			}
		}
	},
	publisherId: {
		type: String,
		autoform: {
			type: "universe-select"
		}
	},
	articles: {
		type: [String],
		optional: true
    },
    journalId:{
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
	ArticleCollectionsSchema.i18n("schemas.collections");
	ArticleCollections.attachSchema(ArticleCollectionsSchema);
});