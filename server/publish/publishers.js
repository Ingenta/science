Meteor.publish('publishers', function() {
    return Publishers.find({}, {sort: ['name']});
});
