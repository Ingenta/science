Template.latestUploadedArticles.helpers({
    latestArticles: function () {
        var journalId = Session.get('currentJournalId');
        if (!journalId)return;
        var a = Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
        if (!a)return;
        return a;
    }
});

Template.recentlyViewedArticles.helpers({
    recentArticles: function () {
        var articleIdList = Session.get("recentViewedArticles");
        if (!articleIdList)return;
        var recentViewedArticles = [];
        articleIdList.forEach(function (oneId) {
            var oneArticle = Articles.findOne(oneId);
            if (oneArticle) recentViewedArticles.push(oneArticle);
        });
        return recentViewedArticles;
    }
});