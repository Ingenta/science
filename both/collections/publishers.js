this.Publishers = new Meteor.Collection("publishers");

PublishersSchema = new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    chinesename: {
        type: String,
        unique: true
    },
    shortname: {
        type: String,
        unique: true
    },
    website: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Url
    },
    descriptions:{
        type:Science.schemas.PublisherMultipleTextAreaSchema,
        optional: true
    },
    picture: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        },
        label: 'Choose file'
    }
});
Meteor.startup(function () {
    PublishersSchema.i18n("schemas.publishers");
    Publishers.attachSchema(PublishersSchema);
});
