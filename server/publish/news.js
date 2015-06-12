Meteor.publish('news', function() {
    return News.find();
});
