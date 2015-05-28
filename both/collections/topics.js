this.Topics = new Meteor.Collection("topics");

TopicsSchema = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    code:{
        type: String,
        unique: true
    },
    level:{
        type: String
    },
    parentName: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    TopicsSchema.i18n("schemas.topics");
    Topics.attachSchema(TopicsSchema);
});
