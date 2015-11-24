this.EmailConfig = new Meteor.Collection("emailConfig");
EmailConfigSchema = new SimpleSchema({
    key: {
        type: String
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
    }
});

Meteor.startup(function () {
    EmailConfigSchema.i18n("schemas.emailconfig");
    EmailConfig.attachSchema(EmailConfigSchema);
})

EmailsSchema  = new SimpleSchema({
    recipient:{
        type:String
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

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
})