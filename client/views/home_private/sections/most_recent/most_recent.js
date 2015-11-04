Template.latestUploadedArticleList.helpers({
    latestUploadedArticles: function () {
        if (this.journalId)
            return Articles.find({journalId: this.journalId}, {sort: {createdAt: -1}, limit: 10});
        return Articles.find({}, {sort: {createdAt: -1}, limit: 10});
    }
});