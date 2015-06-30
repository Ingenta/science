Template.latestArticles.helpers({
    newestArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.recentlyViewedArticles.helpers({
    recentArticles: function () {
        //distinct article views by this user, from today: TODO orderby
        if (!Meteor.userId())return;
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var distinctArticleIds = _.uniq(ArticleViews.find({
                userId: Meteor.userId(),
                when: {$gt: yesterday}
            },
            {
                sort: {when: 1}, fields: {articleId: true}
            }).fetch().map(function (x) {
                return x.articleId;
            }), true);

        if (!distinctArticleIds.length)return;

        var mongoDbArr = [];
        distinctArticleIds.forEach(function (id) {
            mongoDbArr.push({_id: id});
        });

        return Articles.find({$or: mongoDbArr}, {sort: {createdAt: -1}, limit: 3});
    }
});