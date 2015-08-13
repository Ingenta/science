this.EditorialMember = new Meteor.Collection("editorial_member");

this.EditorialMember.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-editorial-member", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-editorial-member", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-editorial-member", "resource", userId);
    }
});

EditorialMemberSchema = new SimpleSchema({
    nameEn: {
        type: String
    },
    nameCn: {
        type: String
    },
    position: {
        type: String
    },
    workUnitEn: {
        type: String
    },
    workUnitCn: {
        type: String
    },
    email: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "email"
            }
        }
    },
    phone: {
        type: String
    },
    fax: {
        type: String
    },
    directionEn: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    directionCn: {
        type: String,
        optional: true,
        autoform: {
            rows: 2
        }
    },
    abstractEn: {
        type: String,
        optional: true,
        autoform: {
            rows: 5
        }
    },
    abstractCn: {
        type: String,
        optional: true,
        autoform: {
            rows: 5
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
    EditorialMemberSchema.i18n("schemas.editorialMember");
    EditorialMember.attachSchema(EditorialMemberSchema);
});