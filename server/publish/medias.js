Meteor.publish('medias', function() {
	return Medias.collection.find();
});