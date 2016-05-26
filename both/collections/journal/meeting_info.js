this.Meeting = new Meteor.Collection("meeting_info");

this.Meeting.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    remove: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    }
});

MeetingSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    startDate: {
        type: Date,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    phone: {
        type: String,
        optional: true,
        max: 25
    },
    address: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    theme: {
        type:Science.schemas.MultipleTextAreaSchema,
        optional: true
    },
    url: {
        type: String,
        optional: true
    },
    about: {
        type: String
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    MeetingSchema.i18n("schemas.meetingInfo");
    Meeting.attachSchema(MeetingSchema);
});
