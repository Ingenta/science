Template.latestArticles.helpers({
    lateArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});