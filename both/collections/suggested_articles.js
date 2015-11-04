this.SuggestedArticles = new Meteor.Collection("suggestedArticles");

SuggestedArticlesSchema = new SimpleSchema({
    articleId: {
        type: String,
        autoform: {
            type: 'universe-select'
        }
    }
});
Meteor.startup(function () {
    SuggestedArticlesSchema.i18n("schemas.suggestedArticles");
    SuggestedArticles.attachSchema(SuggestedArticlesSchema);
});