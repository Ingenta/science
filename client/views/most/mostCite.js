Template.mostCiteArticle.helpers({
    mostCitedArticles: function () {
        var citedAr = undefined;
        var journalId = Router.current().params.journalId;
        if (journalId) citedAr = MostCited.find({journalId: journalId}, {limit: 20}).fetch();
        else citedAr = MostCited.find({}, {limit: 20}).fetch();
        // 获取更多Id
        var allId = [];
        _.each(citedAr, function (item) {
            allId.push(item.articleId);
        });
        // 返回article信息，并排序
        var sort = {};
        if (Session.get("sort"))
            sort = {"published": Session.get("sort")};
        return Articles.find({_id: {$in: allId}}, {sort: sort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});