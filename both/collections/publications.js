this.Publications = new Meteor.Collection("publications");

PublicationsSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    urlname: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    firstletter:{
        type: String,
        max: 1
    },
    accessKey: {
      type: String,
    },
    publisher:
    {
        type: String
    }
});
Meteor.startup(function() {
    PublicationsSchema .i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
