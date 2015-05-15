this.News = new Meteor.Collection("news");

this.News.userCanInsert = function(userId, doc) {
	return Users.isInRoles(userId, ["admin"]);
}

this.News.userCanUpdate = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin","editor"]);
}

this.News.userCanRemove = function(userId, doc) {
	return userId && Users.isInRoles(userId, ["admin"]);
}
