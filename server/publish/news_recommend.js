Meteor.publish('news_recommend', function() {
    return NewsRecommend.find();
});