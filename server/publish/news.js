Meteor.publish('news', function() {
    return News.find();
});
Meteor.publish('homepageNews', function() {
    return News.find({publications: {$exists: false}});
});