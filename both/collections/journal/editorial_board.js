this.EditorialBoard = new Meteor.Collection("editorial_board");

this.EditorialBoard.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    remove: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    }
});

EditorialBoardSchema = new SimpleSchema({
    name: {
        type: Science.schemas.MultipleTextRequiredSchema
    },
    position: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    workUnits: {
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
    email: {
        type: String,
        optional: true
    },
    researchArea: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    abstract: {
        type: Science.schemas.MultipleAreaSchema,
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
    },
    about: {
        type: String
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    EditorialBoardSchema.i18n("schemas.editorialBoard");
    EditorialBoard.attachSchema(EditorialBoardSchema);
});