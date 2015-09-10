this.Advertisement = new Meteor.Collection("advertisement");

this.Advertisement.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-advertisement", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-advertisement", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-advertisement", "resource", userId);
    }
});

AdvertisementSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    link: {
        type: String,
        optional: true
    },
    defaultLink: {
        type: String,
        optional: true
    },
    types: {
        type: String,
        optional: true
    },
    endDate: {
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    pictures: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        }
    },
    defaultPictures: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        }
    },
    publications: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    AdvertisementSchema.i18n("schemas.advertisement");
    Advertisement.attachSchema(AdvertisementSchema);
});
