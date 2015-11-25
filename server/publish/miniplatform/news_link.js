Meteor.publish('news_link', function() {
    return NewsLink.find();
});