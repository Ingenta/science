this.Publications = new Meteor.Collection("publications");

PublicationsSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    shortTitle: {
        type: String,
        max: 10
    },
    issn: {
        type: String,
        unique: true,
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