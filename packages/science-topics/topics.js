this.Topics = new Meteor.Collection("topics");

this.Topics.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-topic", "topic", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-topic", "topic", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-topic", "topic", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("add-article-to-topic", "topic", userId);
    }
});

TopicsSchema = new SimpleSchema({
    name: {//DON'T MAKE THIS UNIQUE
        type: String
    },
    englishName: {
        type: String
    },
    parentId: {
        type: String,
        optional: true
    },
    relatedTopics: {
        type: [String],
        optional: true,
        autoform: {
            type: "universe-select",
            afFieldInput: {
                multiple: true,
                create: false
            }
        }
    }
});

Meteor.startup(function () {
    TopicsSchema.i18n("schemas.topics");
    Topics.attachSchema(TopicsSchema);
});
