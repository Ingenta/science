Meteor.publish('articleViewsByArticleId', function(id) {
    if(!id)return this.ready();
    return PageViews.find({articleId:id});
});