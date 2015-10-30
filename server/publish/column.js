Meteor.publish('column', function() {
    return Column.find();
});