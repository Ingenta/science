Meteor.publish('news_recommend', function() {
    return NewsRecommend.find();
});

Meteor.publish('miniPlatformHomeNewsRecommend', function() {
    return NewsRecommend.find({},{sort: {createDate: -1}, limit: 7});
});

Meteor.publish('miniPlatformMostNewsRecommend', function() {
    return NewsRecommend.find({},{sort: {createDate: -1}, limit: 20,fields: {ArticlesId:1,createDate:1}});
});