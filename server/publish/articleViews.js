Meteor.publish('articleViews', function() {
    return PageViews.find();
});
Meteor.publish('articleViewsByArticleId', function(id) {
    return PageViews.find({articleId:id});
});