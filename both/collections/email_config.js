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