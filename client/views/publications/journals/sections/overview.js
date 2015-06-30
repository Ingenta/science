Template.latestArticles.helpers({
    newestArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.recentlyViewedArticles.helpers({
    recentArticles: function () {
        //distinct article views by this user, from today: TODO only today
        var distinctEntries = _.uniq(ArticleViews.find({userId: Meteor.userId()}, {
            sort: {when: 1}, fields: {articleId: true}
        }).fetch().map(function (x) {
            return x.articleId;
        }), true);

        if (!distinctEntries.length)return;

        var mongoDbArr = [];
        distinctEntries.forEach(function (entry) {
            mongoDbArr.push({_id: entry});
        });

        return Articles.find({$or: mongoDbArr}, {sort: {createdAt: -1}, limit: 3});
    }
});