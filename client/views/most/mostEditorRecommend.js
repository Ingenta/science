Template.mostRecommendArticles.helpers({
    mostRecommendArticles: function () {
        var sort = {};
        var pubSort = {};
        if(Session.get("sort"))
            sort={"createDate":Session.get("sort")};
            pubSort = {"published": Session.get("sort")};
        var journalId = Session.get('currentJournalId');
        var editorRecommends = EditorsRecommend.find({publications: journalId},{sort:sort, limit: 20}).fetch();
        // 获取更多Id
        var allId = [];
        _.each(editorRecommends, function (item) {
            allId.push(item.ArticlesId);
        });
        // 返回article信息，并排序
        return Articles.find({_id: {$in: allId}}, {sort: pubSort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});

Template.mostRecommendArticles.onRendered(function () {
    if (Session.get('sort')===undefined) {
        Session.set('sort', "1");
    }
});