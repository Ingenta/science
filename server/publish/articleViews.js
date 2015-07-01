Meteor.publish('articleViews', function() {
    return ArticleViews.find();
});