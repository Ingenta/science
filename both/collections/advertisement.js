this.Advertisement = new Meteor.Collection("advertisement");

this.Advertisement.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-article", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-article", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-article", "resource", userId);
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
    picture: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                accept: 'image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
            }
        }
    }
});
Meteor.startup(function () {
    AdvertisementSchema.i18n("schemas.advertisement");
    Advertisement.attachSchema(AdvertisementSchema);
});
