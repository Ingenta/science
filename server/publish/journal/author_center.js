Meteor.publish('author_center', function() {
    return AuthorCenter.find();
});
