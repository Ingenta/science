Meteor.publish('medias', function() {
	return Collections.Medias.find();
});

Meteor.publish('articleMediasInfo', function(doi) {
	if (!doi)return this.ready();
	return Collections.Medias.find({doi: doi});
});