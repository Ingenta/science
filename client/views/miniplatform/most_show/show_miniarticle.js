Template.dynamicArticleShow.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.dynamicArticleShow.helpers({
    mostPublishingArticles: function () {
        var newsRecommends = NewsRecommend.find({}, {limit: 20}).fetch();
        // 获取更多Id
        var allId=[];
        _.each(newsRecommends,function(item){
            allId.push(item.ArticlesId);
        });
        // 返回article信息，并排序
        var sort = {};
        if(Session.get("sort"))
            sort={"published":Session.get("sort")};
        return Articles.find({_id:{$in:allId}},{sort:sort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});