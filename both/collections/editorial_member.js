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
    abstractEn: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor'
            }
        }
    },
    abstractCn: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor'
            }
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