Meteor.publish('volumes', function() {
    return Volumes.find();
});
