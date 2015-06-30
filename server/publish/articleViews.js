Meteor.publish('countArticle', function() {
    return ArticleViews.find();
});
