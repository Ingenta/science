this.EmailConfig = new Meteor.Collection("emailConfig");
EmailConfigSchema = new SimpleSchema({
    key: {
        type: String
    },
    frequency: {
        type: String,
        optional: true,
        label: "Frequency",
        autoform: {
            options: [
                {
                    label: "On",
                    value: "on"
                },
                {
                    label: "Off",
                    value: "off"
                }
            ]
        }
    },
    isAlert: {
        type: String,
        optional: true
    },
    subject: {
        type: String
    },
    body: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    },
    lastSentDate: {
        type: Date,
        optional: true
    }
});

Meteor.startup(function () {
    EmailConfigSchema.i18n("schemas.emailconfig");
    EmailConfig.attachSchema(EmailConfigSchema);
})

EmailsSchema  = new SimpleSchema({
    recipient:{
        type:String,
        regEx: SimpleSchema.RegEx.Email
    },
    reasons:{
        type:String,
        optional: true
    },
    url:{
        type:String,
        autoform:{
            type: "hidden"
        }
    },
    doi:{
        type:String,
        autoform:{
            type: "hidden"
        }
    }
});

BroadcastEmailsSchema = new SimpleSchema({
    recipient:{
        type:String,
        regEx: SimpleSchema.RegEx.Email
    },
    subject:{
        type:String
    },
    content: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote'
            }
        }
    }
});

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
    BroadcastEmailsSchema.i18n("schemas.broadcastEmails");
});