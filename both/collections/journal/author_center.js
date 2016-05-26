this.AuthorCenter = new Meteor.Collection("author_center");

this.AuthorCenter.allow({
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

AuthorCenterSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextOptionalSchema
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
    fileName: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    fileId: {
        type: String,
        optional: true,
        autoform: {
            type: "cfs-file",
            collection: "files"
        }
    },
    publications: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    AuthorCenterSchema.i18n("schemas.authorCenter");
    AuthorCenter.attachSchema(AuthorCenterSchema);
});