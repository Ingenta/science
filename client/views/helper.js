Template.toggleField.helpers({
    getContent: function (field) {
        if (typeof field == "object") {
            if (TAPi18n.getLanguage() === "zh-CN") {
                if (!field.cn)return field.en;
                return field.cn;
            }
            if (!field.en)return field.cn;
            return field.en;
        } else {
            return field;
        }
    }
})
Template.sendEmails.events({
    "click .btn-primary": function () {
        if (!Meteor.user())return;
        if (!Meteor.user().emails[0])return;
        if (!Meteor.user().emails[0].address)return;

        var user = Meteor.user().emails[0].address;
        if (Meteor.user().profile)
            if (Meteor.user().profile.realname)
                user = Meteor.user().profile.realname;
        Meteor.call('sendEmail',
            Meteor.user().emails[0].address,
            'eryaer@sina.com',
            user + ' has sent you an article',
            'Click the link below to check it out. \n\n' + Router.current().url);

    }
})

