Meteor.publish('metrics_count', function() {
    return MetricsCount.find();
});

Meteor.publish('oneArticleMetricsCount', function(articleDoi) {
    if(!articleDoi)return this.ready();
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return this.ready();
    return MetricsCount.find({articleId: a._id});
});

Meteor.publish('oneArticleMetricsReport', function(articleId) {
    if(!articleId)return this.ready();
    Meteor.call("getArticlePageViewsPieChartData", articleId, function (err, response) {
        var count = MetricsCount.find({articleId:articleId}, {fields: {_id: 1}});
        if(count){
            count.forEach(function (item) {
                MetricsCount.remove({_id:item._id});
            });
        }
        logger.info("Article to remove a history");
        MetricsCount.insert({articleId: articleId, dataCount: response, type: "1", createDate:new Date()});
        logger.info("ArticlePageViews to insert");
    });
    Meteor.call("getArticlePageLocationReport", "fulltext", articleId, function (err, arr) {
        MetricsCount.insert({articleId: articleId, dataCount: arr, type: "2", createDate:new Date()});
        logger.info("ArticlePageLocation to insert");
    });
    Meteor.call("getArticlePageViewsGraphData", articleId, function (err, response) {
        MetricsCount.insert({articleId: articleId, dataCount: response,type: "3",createDate:new Date()});
        logger.info("ArticlePageViewsGraph to insert");
    });
    return;
});