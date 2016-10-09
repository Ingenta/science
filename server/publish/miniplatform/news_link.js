Meteor.publish('news_link', function() {
    return NewsLink.find();
});

Meteor.publish('miniPlatformCommonNewsLink', function() {
    return NewsLink.find({types:"1"});
});

Meteor.publish('miniPlatformHomeNewsLink', function() {
    return NewsLink.find({types:"3"});
});