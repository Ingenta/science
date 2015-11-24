Meteor.publish('meeting_info', function() {
    return Meeting.find();
});