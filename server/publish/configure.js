Meteor.publish('configure', function() {
    return Configure.find();
});
