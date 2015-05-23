this.Publishers = new Meteor.Collection("publishers");

PublishersSchema  = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    urlname: {
        type: String,
        unique: true
    },
    website: {
        type: String,
        unique: true,
        optional: true,
        regEx: SimpleSchema.RegEx.Url
    },
    description: {
        type: String,
        min: 7,
        autoform: {
            rows: 3
        }
    }
});
Meteor.startup(function() {
    PublishersSchema.i18n("schemas.publishers");
    Publishers.attachSchema(PublishersSchema);
});
