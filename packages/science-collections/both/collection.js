this.Collections = new Meteor.Collection("collections");

CollectionsSchema = new SimpleSchema({
	title: {
		type: String,
		unique: true
	},
	chinesetitle:{
		type: String,
		unique: true
	},
	description:{
		type: String
	},
	chinesedescription: {
		type: String
	}
});
Meteor.startup(function () {
	CollectionsSchema.i18n("schemas.collections");
	Collections.attachSchema(CollectionsSchema);
});
