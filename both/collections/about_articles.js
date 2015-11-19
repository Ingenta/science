this.AboutArticles = new Meteor.Collection("about_articles");

this.AboutArticles.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-about-articles", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-about-articles", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-about-articles", "resource", userId);
    }
});

AboutArticlesSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    description: {
        type: Science.schemas.MultipleTextAreaSchema
    },
    about: {
        type: String
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    AboutArticlesSchema.i18n("schemas.aboutArticles");
    AboutArticles.attachSchema(AboutArticlesSchema);
});
