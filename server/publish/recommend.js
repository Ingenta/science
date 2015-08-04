Meteor.publish('recommend', function() {
    return Recommend.find();
});
