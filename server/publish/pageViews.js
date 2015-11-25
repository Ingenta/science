Meteor.publish('articleViewsByArticleId', function(id) {
    return PageViews.find({articleId:id});
});