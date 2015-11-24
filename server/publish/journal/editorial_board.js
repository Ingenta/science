Meteor.publish('editorial_board', function() {
    return EditorialBoard.find();
});