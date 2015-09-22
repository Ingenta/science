Meteor.publish('specialTopics', function() {
    return SpecialTopics.find();
});