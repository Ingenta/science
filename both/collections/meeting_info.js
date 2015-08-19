this.Meeting = new Meteor.Collection("meeting_info");

MeetingSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultiLangSchema
    },
    startDate: {
        type: Date,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
        }
    },
    address: {
        type: Science.schemas.MultipleTextSchema,
        optional: true
    },
    phone: {
        type: String,
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
