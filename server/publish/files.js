Meteor.publish("files", function() {
	return Collections.Files.find();
});