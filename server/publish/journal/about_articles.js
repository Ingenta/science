Meteor.publish('about_articles', function() {
    return AboutArticles.find();
});
