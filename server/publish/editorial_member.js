Meteor.publish('editorial_member', function() {
    return EditorialMember.find();
});
