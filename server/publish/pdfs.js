Meteor.publish("pdfs", function() {
	return Collections.Pdfs.find();
});