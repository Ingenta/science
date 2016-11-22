Meteor.publish('usersPageType', function(type) {
    return Meteor.users.find({level:type});
});