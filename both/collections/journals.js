this.Journals = new Meteor.Collection("journals");

this.Journals.userCanInsert = function(userId, doc) {
	return true;
}

this.Journals.userCanUpdate = function(userId, doc) {
	return true;
}

this.Journals.userCanRemove = function(userId, doc) {
	return true;
}
