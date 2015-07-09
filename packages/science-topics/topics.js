this.Topics = new Meteor.Collection("topics");

this.Topics.allow({
	insert: function (userId, doc) {
		return Permissions.userCan("add-topic", "topic", userId);
	},
	update: function (userId, doc) {
		return Permissions.userCan("modify-topic", "topic", userId);
	},
	remove: function(userId,doc){
		return Permissions.userCan("delete-topic","topic",userId);
	}
});

TopicsSchema = new SimpleSchema({
	name       : {
		type: String,
		max : 32
	},
	englishName: {
		type: String,
		max : 64
	},
	parentId   : {
		type    : String,
		optional: true
	}
});

Meteor.startup(function () {
	TopicsSchema.i18n("schemas.topics");
	Topics.attachSchema(TopicsSchema);
});
