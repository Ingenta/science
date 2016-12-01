Meteor.publish('medias', function() {
	return Collections.Medias.find();
});

Meteor.publish('journalMediasInfo', function(journalShortTitle) {
	if (!journalShortTitle)return this.ready();
	check(journalShortTitle, String);
	var journal = Publications.findOne({shortTitle: journalShortTitle});
	if (!journal)return this.ready();
	var journalId = journal._id;
	return Collections.Medias.find({"journalId": journalId, doi: null});
});

Meteor.publish('articleMediasInfo', function(doi) {
	if (!doi)return this.ready();
	return Collections.Medias.find({doi: doi});
});