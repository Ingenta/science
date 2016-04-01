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
    title: {
        type: Science.schemas.MultipleTextOptionalSchema
    },
    author: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    content: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    releaseTime: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    publisher: {
        type: String,
        optional: true
    },
    types: {
        type: String,
        optional: true
    },
    pageView: {
        type:Number,
        defaultValue: 0,
        optional: true
    }
});
Meteor.startup(function () {
    JournalACSchema.i18n("schemas.journalAC");
    JournalAC.attachSchema(JournalACSchema);
});