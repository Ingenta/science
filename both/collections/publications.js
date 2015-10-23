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
        type: String
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
        type: Science.schemas.MultipleTextOptionalSchema
    },
    competentOrganization: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    sponsor: {
        type: Science.schemas.MultipleTextOptionalSchema,
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
    included: {
        type: [String],
        optional: true,
        autoform:{
            type: "universe-select",
            afFieldInput: {
                multiple: true,
                create: false
            }
        }
    },
    language: {
        type: String
    },
    topicId: {
        type: [String],
        optional: true,
        autoform:{
            type: "universe-select",
            afFieldInput: {
                multiple: true,
                create: false
            }
        }
    },
    email: {
        type: String,
        optional: true
    },
    address: {
        type: Science.schemas.MultipleTextOptionalSchema,
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
    authorTitle: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    authorDescription: {
        type: Science.schemas.MultipleAreaSchema,
        optional: true
    },
    fileName: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    authorPicture: {
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
    fileId: {
        type: String,
        optional: true,
        autoform: {
            type: "cfs-file",
            collection: "files"
        }
    },
    accessKey: {
        type: String
    },
    visible: {
        type: String
    },
    description: {
        optional:true,
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
    },
    historicalJournal: {
        type: [Object],
        optional: true
    },
    "historicalJournal.$.title": {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    "historicalJournal.$.dateRange": {
        type: String,
        optional: true
    },
    "historicalJournal.$.issn": {
        type: String,
        max: 9,
        optional: true
    },
    "historicalJournal.$.essn": {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    PublicationsSchema.i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});
if (Meteor.isClient) {
    myPubPagination = new Paginator(Publications);
}