Meteor.publish('mostCited', function() {
    return MostCited.find();
});

