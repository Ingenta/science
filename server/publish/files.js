Meteor.publish("files", function() {
	return Collections.JournalMediaFileStore.find();
});