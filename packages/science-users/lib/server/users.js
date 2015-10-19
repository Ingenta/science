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
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
        return '中国科学出版社账号激活邮件 Confirm Your Email Address';
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
    Accounts.emailTemplates.verifyEmail.text = function (user, url) {
        return '欢迎使用中国科学出版社平台，请点击下方的链接以激活您的账号:\n\n' + url;
    };

    Accounts.emailTemplates.resetPassword.subject = function (user) {
        return '中国科学出版社重置您的密码 Reset Password';
    };

    Accounts.emailTemplates.resetPassword.text = function (user, url) {
        return "请点击下面的链接以重置您的密码 To reset your password, simply click the link below:\n\n"
            + url;
    };

    Accounts.emailTemplates.resetPassword.html = function (user, url) {
        return "<hr><p>请点击下面的链接以重置您的密码 To reset your password, simply click the link below:</p><hr>"
            + url;
    };

});

//override default publish
Meteor.publish(null, function () {
    if (this.userId) {
        var query = {};
        var fields = {
            profile: 1,
            username: 1,
            emails: 1,
            disable: 1,
            orbit_roles: 1,
            favorite: 1,
            watch: 1,
            watchArticle: 1,
            institutionId: 1,
            publisherId: 1,
            journalId: 1,
            emailFrequency: 1
        };
        if (!OrbitPermissions.isAdmin(Meteor.user())) {
            if (Permissions.userCan("add-user", "publisher", this.userId)){
                query.publisherId = Users.findOne({_id: this.userId}).publisherId;
            } else{
                query._id = this.userId;
            }
        }
        return Meteor.users.find(query, {fields: fields});
    } else {
        return null;
    }
});

Users.before.insert(function (userId, doc) {
    doc.disable = false;
});

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset_password/' + token);
};

Accounts.validateLoginAttempt(function (attempt) {
    if (Config && Config.isDevMode)//开发模式不检查邮箱是否已验证
        return true;
    if (attempt.user && attempt.user.disable) {
        throw new Meteor.Error(403, 'user_blocked');
    }
    if(attempt.user && attempt.user.emails && !attempt.user.emails[0].verified )
        throw new Meteor.Error(100002, "email not verified" );
    return true;
});

Accounts.onCreateUser(function (options, user) {
    if (options.profile)
        user.profile = options.profile;
    if (options.institutionId)
        user.institutionId = options.institutionId;
    if (options.publisherId)
        user.publisherId = options.publisherId;
    if (options.journalId)
        user.journalId = options.journalId;
    return user;
});
