this.ArticleCollections = new Meteor.Collection("articleCollections");

ArticleCollections.allow({
	insert: function (userId, doc) {
		if (!doc.journalId)
			return Permissions.userCan("add-publisher-collections", "collections", userId);
		if (doc.journalId)
			return Permissions.userCan("add-journal-collections", "collections", userId);
	},
	update: function (userId, doc) {
		if (!doc.journalId)
			return Permissions.userCan("modify-publisher-collections", "collections", userId);
		if (doc.journalId)
			return Permissions.userCan("modify-journal-collections", "collections", userId);
	},
	remove: function(userId,doc){
		if (!doc.journalId)
			return Permissions.userCan("delete-publisher-collections", "collections", userId);
		if (doc.journalId)
			return Permissions.userCan("delete-journal-collections", "collections", userId);
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
			type: "universe-select",
			afFieldInput: {
				create: false
			}
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