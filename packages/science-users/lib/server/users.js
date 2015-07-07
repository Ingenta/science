Meteor.startup(function () {
    var smtp = {
        username: 'eryaer',   // eg: server@gentlenode.com
        password: '6852975',   // eg: 3eeP1gtizk5eziohfervU
        server: 'smtp.sina.com',  // eg: mail.gandi.net
        port: 25
    }
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
    Accounts.emailTemplates.from = 'SCP <eryaer@sina.com>';

    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
    Accounts.emailTemplates.siteName = '中国科学出版社 Science China Publisher';

    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function(user) {
        return '中国科学出版社账号激活邮件 Confirm Your Email Address';
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
        return '欢迎使用中国科学出版社平台，请点击下方的链接以激活您的账号:<br> ' + url;
    };

});



Users.before.insert(function(userId, doc) {
    if(doc.emails && doc.emails[0] && doc.emails[0].address) {
        doc.profile = doc.profile || {};
        doc.profile.email = doc.emails[0].address;
    }
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
    if(modifier.$set && modifier.$set.emails && modifier.$set.emails.length && modifier.$set.emails[0].address) {
        modifier.$set.profile.email = modifier.$set.emails[0].address;
    }
});

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset_password/' + token);
};
