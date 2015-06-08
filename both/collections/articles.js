this.Articles = new Meteor.Collection("articles");

ArticlesSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    authors:{
        type: String
    },
    publisher:{
        type: String
    },
    volume:{
        type: String
    },
    issue:{
        type: String
    },
    journalId: {
        type: String
    },
    volumeId:{
        type: String
    },
    issueId: {
        type: String
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
