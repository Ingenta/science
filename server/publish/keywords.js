Meteor.publish('keywords', function() {
    return Keywords.find();
});
