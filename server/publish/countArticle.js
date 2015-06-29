Meteor.publish('countArticle', function() {
    return CountArticle.find();
});
