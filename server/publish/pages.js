Meteor.publish('pages', function() {
    return PageHeadings.find();
});
