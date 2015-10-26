this.NewsLink = new Meteor.Collection("news_link");

this.NewsLink.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-news-link", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-news-link", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-news-link", "resource", userId);
    }
});

NewsLinkSchema = new SimpleSchema({
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
    link: {
        type: String,
        optional: true
    },
    types: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    NewsLinkSchema.i18n("schemas.newsLink");
    NewsLink.attachSchema(NewsLinkSchema);
});