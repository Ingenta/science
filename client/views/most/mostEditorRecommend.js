Template.mostRecommendArticles.helpers({
    mostRecommendArticles: function () {
        var pubSort = {};
        if (Session.get("sort")) {
            pubSort = {"published": Session.get("sort")};
        }
        var journalId = Router.current().params.journalId;
        var editorRecommends = EditorsRecommend.find({publications: journalId}, {sort: {createDate: -1}, limit: 20}).fetch();
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