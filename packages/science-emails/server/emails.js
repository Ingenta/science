Meteor.methods({
    sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    },
    sendHtmlEmail: function (to, from, subject, html) {
        check([to, from, subject, html], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: from,
            subject: subject,
            html: html
        });
    },
    emailThis: function (values) {
        if (!Meteor.user())return;
        if (!Meteor.user().emails[0])return;
        if (!Meteor.user().emails[0].address)return;

        var user = Meteor.user().emails[0].address;
        if (Meteor.user().profile)
            if (Meteor.user().profile.realName)
                user = Meteor.user().profile.realName;

        if (values.reasons === undefined)values.reasons = "";

        var reason = values.reasons + ' \n\n'
        var emailSubject = user + ' has sent you an article';
        var emailBody = reason + 'Click the link below to check it out. \n\n' + values.url;

        var emailThisContent = EmailConfig.findOne({key: "emailThis"});
        if (emailThisContent) {
            if (emailThisContent.subject)emailSubject = emailThisContent.subject;
            if (emailThisContent.body)emailBody = emailThisContent.body + '\n\n' + emailBody;
        }

        Meteor.defer(function () {
            Email.send({
                to: values.recipient,
                from: 'publish@scichina.org',
                subject: emailSubject,
                text: emailBody
            });
        });

    }
});