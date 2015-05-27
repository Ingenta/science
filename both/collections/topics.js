this.Topics = new Meteor.Collection("topics");

TopicsSchema = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    contacts: {
        type: Array,
        optional: true
    },
    'contacts.$': {
        type: Object
    },
    'contacts.$.name': {
        type: String
    }
});

Meteor.startup(function () {
//    TopicsSchema.i18n("schemas.topics");
//    Topics.attachSchema(TopicsSchema);
});
