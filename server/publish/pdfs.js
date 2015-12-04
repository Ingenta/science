Meteor.publish("pdfs", function() {
	return PdfStore.find();
});