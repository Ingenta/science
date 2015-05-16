this.Publishers = new Meteor.Collection("publishers");

this.Publishers.userCanInsert = function(userId, doc) {
    return true;
}

this.Publishers.userCanUpdate = function(userId, doc) {
    return true;
}

this.Publishers.userCanRemove = function(userId, doc) {
    return true;
}
