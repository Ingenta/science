Meteor.publish('most_count', function() {
    return MostCount.find();
});