this.Publishers = new Meteor.Collection("publishers");

PublishersSchema  = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    chinesename: {
        type: String,
        unique: true
    },
    website: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Url
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    chinesedescription: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    }
});
Meteor.startup(function() {
    PublishersSchema.i18n("schemas.publishers");
    Publishers.attachSchema(PublishersSchema);
});
