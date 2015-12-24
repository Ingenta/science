this.AuthorCenter = new Meteor.Collection("author_center");

this.AuthorCenter.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-author-center", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-author-center", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-author-center", "resource", userId);
    }
});

AuthorCenterSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    url: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        optional: true
    },
    parentId: {
        type: String,
        optional: true,
        autoform: {
            type: 'universe-select'
        }
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    AuthorCenterSchema.i18n("schemas.authorCenter");
    AuthorCenter.attachSchema(AuthorCenterSchema);
});