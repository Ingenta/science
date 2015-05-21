this.Publishers = new Meteor.Collection("publishers");
this.Publishers.attachSchema(new SimpleSchema({
    name: {
        type: String,
        min: 10
    },
    description: {
        type: String,
        min: 10
    }
}
));
this.Publishers.userCanInsert = function(userId, doc) {
    return true;
}

this.Publishers.userCanUpdate = function(userId, doc) {
    return true;
}

this.Publishers.userCanRemove = function(userId, doc) {
    return true;
}
