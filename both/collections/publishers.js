this.Publishers = new Meteor.Collection("publishers");

PublishersSchema  = new SimpleSchema({
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
        min: 7,
        autoform: {
            rows: 3
        }
    }
});
Meteor.startup(function() {
    PublishersSchema.i18n("schemas.publishers");
    Publishers.attachSchema(PublishersSchema);
});
// this.Publishers.userCanInsert = function(userId, doc) {
//     return true;
// }

// this.Publishers.userCanUpdate = function(userId, doc) {
//     return true;
// }

// this.Publishers.userCanRemove = function(userId, doc) {
//     return true;
// }
