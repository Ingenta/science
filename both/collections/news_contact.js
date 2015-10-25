this.NewsContact = new Meteor.Collection("news_contact");

this.NewsContact.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-news-contact", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-news-contact", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-news-contact", "resource", userId);
    }
});

NewsContactSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    types: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    NewsContactSchema.i18n("schemas.newsContact");
    NewsContact.attachSchema(NewsContactSchema);
});