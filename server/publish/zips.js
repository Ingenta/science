Meteor.publish('zips', function() {
	return Zips.find({});
});
