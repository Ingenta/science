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
        type: String,
        optional: true
    },
    content: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor'
            }
        }
    },
    link: {
        type: String,
        optional: true
    },
    fileName: {
        type: String,
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
    types: {
        type: String,
        optional: true
    },
    createDate: {
        type: Date
    }
});
Meteor.startup(function () {
    NewsContactSchema.i18n("schemas.newsContact");
    NewsContact.attachSchema(NewsContactSchema);
});