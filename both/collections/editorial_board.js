this.EditorialBoard = new Meteor.Collection("editorial_board");

this.EditorialBoard.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-editorial-board", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-editorial-board", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-editorial-board", "resource", userId);
    }
});

EditorialBoardSchema = new SimpleSchema({
    name: {
        type: Science.schemas.MultiplePersonNameSchema
    },
    position: {
        type: String,
        optional: true
    },
    workUnits: {
        type: Science.schemas.MultipleTextSchema
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
        type: Science.schemas.MultipleTextSchema
    },
    abstract: {
        type: Science.schemas.MultipleAreaSchema
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