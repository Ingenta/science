Meteor.publish('articleViews', function() {
    return ArticleViews.find();
});
Meteor.publish('articleViewsByArticleId', function(id) {
    return ArticleViews.find({articleId:id});
});