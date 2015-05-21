this.Publishers = new Meteor.Collection("publishers");
this.Publishers.attachSchema(new SimpleSchema({
    name: {
        type: String,
        unique: true
    },
    urlname: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        min: 5
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
