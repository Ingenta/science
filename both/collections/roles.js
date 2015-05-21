this.Roles = new Meteor.Collection("roles");
this.Roles.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 10
    }
}
));
this.Roles.userCanInsert = function(userId, doc) {
    return true;
}

this.Roles.userCanUpdate = function(userId, doc) {
    return true;
}

this.Roles.userCanRemove = function(userId, doc) {
    return true;
}
