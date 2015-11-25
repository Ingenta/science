this.JournalAC = new Meteor.Collection("journal_ad");

this.JournalAC.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-journalAC", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-journalAC", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-journalAC", "resource", userId);
    }
});

JournalACSchema = new SimpleSchema({
    journalId: {
        type: String,
        unique: true,
        autoform: {
            type: 'universe-select'
        }
    },
    link: {
        type: String,
        optional: true
    },
    fileId: {
        type: String,
        optional: true,
        autoform: {
            type: "cfs-file",
            collection: "files"
        }
    },
    publisher: {
        type: String,
        optional: true
    },
    types: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    JournalACSchema.i18n("schemas.journalAC");
    JournalAC.attachSchema(JournalACSchema);
});