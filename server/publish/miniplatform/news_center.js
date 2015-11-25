Meteor.publish('news_center', function() {
    return NewsCenter.find();
});