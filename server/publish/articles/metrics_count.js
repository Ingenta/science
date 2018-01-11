Meteor.publish('metrics_count', function() {
    return MetricsCount.find();
});

Meteor.publish('oneArticleMetricsCount', function(articleDoi) {
    if(!articleDoi)return this.ready();
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return this.ready();
    return MetricsCount.find({articleId: a._id});
});