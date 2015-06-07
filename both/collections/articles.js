this.Articles = new Meteor.Collection("articles");

ArticlesSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    volume:{
        type: String
    },
    issue:{
        type: String
    },
    journalId: {
        type: String,
        optional:true
    },
    issueId: {
        type: String,
        optional:true
    },
    year:{
        type: String
    },
    month:{
        type: String
    }
});
Meteor.startup(function() {
    ArticlesSchema.i18n("schemas.article");
    Articles.attachSchema(ArticlesSchema);
});
