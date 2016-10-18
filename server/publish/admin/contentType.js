Meteor.publish('contentType', function() {
    return ContentType.find();
});