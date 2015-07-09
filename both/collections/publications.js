this.Publications = new Meteor.Collection("publications");

this.Publications.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-journal", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId);
    },
    remove: function(userId,doc){
        return Permissions.userCan("delete-journal","resource",userId);
    }
});

PublicationsSchema = new SimpleSchema({
    title: {
        type: String
    },
    shortTitle: {
        type: String,
        max: 10
    },
    issn: {
        type: String,
        max: 9
    },
    accessKey: {
        type: String
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
    publisher: {
        type: String
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
    },
    banner: {
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
    tabSelections: {
        type: [String],
        optional: true,
        autoform: {
            type: "select-checkbox-inline"
        }
    }
});
Meteor.startup(function () {
    PublicationsSchema.i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
if (Meteor.isClient) {
    myPubPagination = new Paginator(Publications);
}