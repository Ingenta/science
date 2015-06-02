this.Topics = new Meteor.Collection("topics");

TopicsSchema = new SimpleSchema({
    name: {
        type: String,
//        unique: true,
        max: 32
    },
    englishName: {
        type: String,
//        unique: true,
        max: 64
    },
    parentId: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    TopicsSchema.i18n("schemas.topics");
    Topics.attachSchema(TopicsSchema);
});
