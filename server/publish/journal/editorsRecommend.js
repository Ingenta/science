Meteor.publish('recommend', function() {
    return EditorsRecommend.find();
});
