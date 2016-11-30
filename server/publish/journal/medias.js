Meteor.publish('medias', function() {
	return Collections.Medias.find();
});

Meteor.publish('journalMediasInfo', function(journalShortTitle) {
	if(journalShortTitle) {
		check(journalShortTitle, String);
		var journal = Publications.findOne({shortTitle: journalShortTitle});
		if (!journal)return this.ready();
		var journalId = journal._id;
		return Collections.Medias.find({"journalId": journalId, doi: null});
	}
});

Meteor.publish('articleMediasInfo', function(doi) {
	if(doi) {
		check(doi, String);
		return Collections.Medias.find({doi: doi});
	}
});