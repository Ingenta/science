Meteor.publish('tag', function() {
    return Tags.find();
});