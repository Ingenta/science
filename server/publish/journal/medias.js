Meteor.publish('medias', function() {
	return Collections.Medias.find();
});

Meteor.publish('journalMediasInfo', function(journalId) {
	if (!journalId)return this.ready();
	return Collections.Medias.find({"journalId": journalId, doi: null});
});

Meteor.publish('articleMediasInfo', function(doi) {
	if (!doi)return this.ready();
	return Collections.Medias.find({doi: doi});
});