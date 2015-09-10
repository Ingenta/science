Meteor.publish('advertisement', function() {
    return Advertisement.find();
});
