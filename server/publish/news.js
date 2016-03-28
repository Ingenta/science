Meteor.publish('news', function() {
    return News.find();
});
//TODO: make a homepage and journal subscription