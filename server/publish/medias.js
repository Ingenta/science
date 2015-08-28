Meteor.publish('medias', function() {
	return Collections.Medias.find();
});