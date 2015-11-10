Template.dynamicArticleShow.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.dynamicArticleShow.helpers({
    mostPublishingArticles: function () {
        var sort = {};
        var pubSort = {};
        if(Session.get("sort"))
            sort={"createDate":Session.get("sort")};
            pubSort = {"published": Session.get("sort")};
        var newsRecommends = NewsRecommend.find({},{sort:sort, limit: 20}).fetch();
        // 获取更多Id
        var allId=[];
        _.each(newsRecommends,function(item){
            allId.push(item.ArticlesId);
        });
        // 返回article信息
        return Articles.find({_id:{$in:allId}},{sort:pubSort});
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