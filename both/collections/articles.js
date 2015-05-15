this.Articles = new Meteor.Collection("articles");

this.Articles.userCanInsert = function(userId, doc) {
	return true;
}

this.Articles.userCanUpdate = function(userId, doc) {
	return true;
}

this.Articles.userCanRemove = function(userId, doc) {
	return true;
}
