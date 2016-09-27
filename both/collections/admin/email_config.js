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
            type: "jkfroala",
            afFieldInput: {
                froalaOptions: {
                    language: 'zh_cn',
                    inlineMode: false,
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'selectAll', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'table', 'undo', 'redo', 'html', 'insertHorizontalRule', 'removeFormat', 'fullscreen'],
                    height: '400',
                    imageUploadURL: "/upload_froala",
                    fileUploadURL: "/upload_froala_file"
                }
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
    sender:{
        type:String,
        regEx: SimpleSchema.RegEx.Email
    },
    recipient:{
        type:String,
        optional:true,
        regEx:/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6};?)*$/i //支持用;分隔的多个邮箱地址
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
        optional:true,
        regEx:/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6};?)*$/i //支持用;分隔的多个邮箱地址
    },
    userLevel:{
        type:[String],
        optional:true,
        autoform: {
            type: "select-checkbox",
            options: function () {
                return [
                    {label: TAPi18n.__("level.admin"), value: "admin"},
                    {label: TAPi18n.__("level.publisher"), value: "publisher"},
                    {label: TAPi18n.__("level.institution"), value: "institution"},
                    {label: TAPi18n.__("level.normal"), value: "normal"}
                ];
            }
        }
    },
    subject:{
        type:String
    },
    content: {
        type: String,
        autoform: {
            type: "jkfroala",
            afFieldInput: {
                froalaOptions: {
                    language: 'zh_cn',
                    inlineMode: false,
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'color', 'formatBlock', 'blockStyle', 'inlineStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'selectAll', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'table', 'undo', 'redo', 'html', 'insertHorizontalRule', 'removeFormat', 'fullscreen'],
                    height: '400',
                    imageUploadURL: "/upload_froala",
                    fileUploadURL: "/upload_froala_file"
                }
            }
        }
    }
});

Meteor.startup(function(){
    EmailsSchema.i18n("schemas.emails");
    BroadcastEmailsSchema.i18n("schemas.broadcastEmails");
});