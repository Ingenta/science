Meteor.publish('news_center', function() {
    return NewsCenter.find();
});

Meteor.publish('miniPlatformHomeScpNews', function() {
    return NewsCenter.find({recommend:"1",types:"2"},{sort: {releaseTime: -1}, limit: 5});
});

Meteor.publish('miniPlatformHomePublishingNews', function() {
    return NewsCenter.find({recommend:"1",types:"3"},{sort: {releaseTime: -1}, limit: 5});
});

Meteor.publish('miniPlatformMostScpNews', function() {
    return NewsCenter.find({recommend:"1",types:"2"},{sort: {releaseTime: -1}, limit: 20});
});

Meteor.publish('miniPlatformMostPublishingNews', function() {
    return NewsCenter.find({recommend:"1",types:"3"},{sort: {releaseTime: -1}, limit: 20});
});

Meteor.publish('miniPlatformHomeNewsShow', function() {
    return NewsCenter.find({recommend:"2"},{sort: {releaseTime: -1}, limit: 3});
});

Meteor.publish('miniPlatformNews', function (newsId) {
    check(newsId, String);
    return NewsCenter.find({_id: newsId});
});

Meteor.publish('miniPlatformLastNews', function() {
    return NewsCenter.find({},{sort: {releaseTime: -1}, limit: 10});
});