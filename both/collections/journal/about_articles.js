this.AboutArticles = new Meteor.Collection("about_articles");

this.AboutArticles.allow({
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

AboutArticlesSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextRequiredSchema
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
