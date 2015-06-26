Template.latestArticles.helpers({
    lateArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    },
    urlToArticle: function (title) {
        var article = Articles.findOne({title: title});
        var publisherName = Publishers.findOne({_id: article.publisher}).name;
        var journalName = Publications.findOne({_id: article.journalId}).title;
        return "/publisher/" + publisherName + "/journal/" + journalName + "/article/" + title;
    },
});