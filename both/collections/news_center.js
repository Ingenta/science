this.NewsCenter = new Meteor.Collection("news_center");

this.NewsCenter.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-news-center", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-news-center", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-news-center", "resource", userId);
    }
});

NewsCenterSchema = new SimpleSchema({
    title: {
        type: String
    },
    author: {
        type: String,
        optional: true
    },
    abstract: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
    content: {
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
                rows: 4
            }
        }
    },
    recommend: {
        type: String,
        optional: true
    },
    url: {
        type: String,
        optional: true
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
    types: {
        type: String
    },
    createDate: {
        type: Date
    },
    pageView: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    NewsCenterSchema.i18n("schemas.newsCenter");
    NewsCenter.attachSchema(NewsCenterSchema);
});