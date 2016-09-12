Template.dynamicArticleShow.helpers({
    mostPublishingArticles: function () {
        var pubSort = {};
        if(Session.get("sort"))
            pubSort = {"published": Session.get("sort")};
        var recommendArticle = NewsRecommend.find({},{limit:20}).fetch();
        // 获取更多Id
        var allId = [];
        _.each(recommendArticle, function (item) {
            allId.push(item.ArticlesId);
        });
        // 返回article信息，并排序
        return Articles.find({_id: {$in: allId}}, {sort: pubSort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});

Template.dynamicArticleShow.onRendered(function () {
    if (Session.get('sort')===undefined) {
        Session.set('sort', "1");
    }
});