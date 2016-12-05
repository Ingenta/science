Meteor.publish('news_recommend', function() {
    return NewsRecommend.find();
});

Meteor.publish('recommendedMiniPlatformArticles', function (limit) {
    var recommended = NewsRecommend.find({},{sort: {createDate: -1}, limit: limit});
    var articleIds = _.pluck(recommended.fetch(), "ArticlesId");
    return [
        Articles.find({_id: {$in: articleIds}}, {fields: articleWithMetadata}),
        recommended
    ]
});