this.Meeting = new Meteor.Collection("meeting_info");

this.Meeting.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-meeting-info", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-meeting-info", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-meeting-info", "resource", userId);
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
