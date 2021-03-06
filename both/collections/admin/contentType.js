this.ContentType = new Meteor.Collection("contentType");

this.ContentType.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-contentType", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-contentType", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-contentType", "resource", userId);
    }
});

ContentTypeSchema = new SimpleSchema({
    subject: {
        type: String,
        unique: true,
        regEx:/^[A-Za-z]+$/ //仅支持英文字母
    },
    name: {
        type: Science.schemas.MultipleTextRequiredSchema
    },
    references: {
        type: String,
        autoform: {
            rows: 2
        }
    },
    createDate: {
        type: Date
    }
});
Meteor.startup(function () {
    ContentTypeSchema.i18n("schemas.contentType");
    ContentType.attachSchema(ContentTypeSchema);
});

if (Meteor.isClient) {
    contentTypePagination = new Paginator(ContentType);
}