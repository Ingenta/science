this.AboutArticles = new Meteor.Collection("about_articles");

AboutArticlesSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    chinesetitle: {
        type: String,
    },
	description: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
	chinesedescription: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    },
    about: {
        type: String
    }
});
Meteor.startup(function () {
    AboutArticlesSchema.i18n("schemas.aboutArticles");
    AboutArticles.attachSchema(AboutArticlesSchema);
});
