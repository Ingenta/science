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
    nameEn: {
        type: String
    },
    nameCn: {
        type: String
    },
    position: {
        type: String,
        optional: true
    },
    WorkUnitsEn: {
        type: String,
        optional: true
    },
    WorkUnitsCn: {
        type: String,
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
    researchAreaEn: {
        type: String,
        optional: true
    },
    researchAreaCn: {
        type: String,
        optional: true
    },
    abstractEn: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
    abstractCn: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
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