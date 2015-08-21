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
    titleCn: {
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
    createdBy: {
        type: String
    },
    createDate: {
        type: Date
    },
    chiefEditor: {
        type: Science.schemas.MultipleTextSchema
    },
    competentOrganization: {
        type: Science.schemas.MultipleTextSchema,
        optional: true
    },
    sponsor: {
        type: Science.schemas.MultipleTextSchema,
        optional: true
    },
    EISSN: {
        type: String,
        optional: true
    },
    CN: {
        type: String
    },
    publicationDate: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    frequencyPublication: {
        type: String,
        optional: true
    },
    embody: {
        type: String,
        optional: true
    },
    language: {
        type: String,
        optional: true
    },
    topicId: {
        type: String,
        unique: true,
        autoform: {
            type: 'universe-select'
        }
    },
    email: {
        type: String,
        optional: true
    },
    address: {
        type: Science.schemas.MultipleTextSchema,
        optional: true
    },
    phone: {
        type: String,
        optional: true
    },
    fax: {
        type: String,
        optional: true
    },
    accessKey: {
        type: String
    },
    visible: {
        type: String
    },
    description: {
        type: Science.schemas.MultipleAreaSchema
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