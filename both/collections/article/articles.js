this.Articles = new Meteor.Collection("articles");


this.Articles.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-article", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-article", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-article", "resource", userId);
    }
});

ArticleTitleSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    }
});
ArticleAbstractSchema = new SimpleSchema({
    abstract: {
        type: Science.schemas.MultipleTextAreaSchema
    }

});
ArticleSchema = new SimpleSchema({
    accessKey: {
        type: String
    },
    language: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    ArticleTitleSchema.i18n("schemas.articles");
    ArticleAbstractSchema.i18n("schemas.articles");
    ArticleSchema.i18n("schemas.articles");
});