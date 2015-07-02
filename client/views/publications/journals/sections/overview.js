Template.latestArticles.helpers({
    newestArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.recentlyViewedArticles.helpers({
    recentArticles: function () {
        var articleIdList = Session.get("recentViewedArticles");
        if (!articleIdList)return;
        var recentViewedArticles = [];
        articleIdList.forEach(function(oneId){
            var oneArticle = Articles.findOne(oneId);
            if(oneArticle) recentViewedArticles.push(oneArticle);
        });
        return recentViewedArticles;
    }
});