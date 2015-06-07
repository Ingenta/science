Meteor.publish('issues', function() {
    return Issues.find();
});
