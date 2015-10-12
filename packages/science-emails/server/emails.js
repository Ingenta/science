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
    emailThis: function(values){
        if (!Meteor.user())return;
        if (!Meteor.user().emails[0])return;
        if (!Meteor.user().emails[0].address)return;

        var user = Meteor.user().emails[0].address;
        if (Meteor.user().profile)
            if (Meteor.user().profile.realname)
                user = Meteor.user().profile.realname;
        if(values.reasons===undefined)values.reasons="";
        var reason = values.reasons + ' \n\n'

        Meteor.defer(function(){
            Email.send({
                to: values.recipient,
                from: 'eryaer@sina.com',
                subject: user + ' has sent you an article',
                text: reason + 'Click the link below to check it out. \n\n' + values.url
            });
        });

    }
});