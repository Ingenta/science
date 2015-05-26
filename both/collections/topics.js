this.Topics = new Meteor.Collection("topics");

TopicsSchema  = new SimpleSchema({
    name: {
        type: String,
        unique: true
    }
});
Meteor.startup(function() {
    TopicsSchema.i18n("schemas.topics");
    Topics.attachSchema(TopicsSchema);
});
