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
    Accounts.emailTemplates.siteName = '《中国科学》杂志社平台 Science China Publishing';


    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
        return EmailConfig.findOne({key: "verifyEmail"}).subject;
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html

    Accounts.emailTemplates.verifyEmail.html = function (user, url) {
        return EmailConfig.findOne({key: "verifyEmail"}).body
            + "<a href='" + url + "'>" + url + "</a>";
    };

    Accounts.emailTemplates.resetPassword.subject = function (user) {
        return EmailConfig.findOne({key: "forgotPassword"}).subject;
    };

    Accounts.emailTemplates.resetPassword.html = function (user, url) {
        return EmailConfig.findOne({key: "forgotPassword"}).body
            + "<a href='" + url + "'>" + url + "</a>";
    };

    Accounts.emailTemplates.enrollAccount.subject = function (user) {
        return EmailConfig.findOne({key: "registration"}).subject;
    };

    Accounts.emailTemplates.enrollAccount.html = function (user, url) {
        return EmailConfig.findOne({key: "registration"}).body
            + "<a href='" + url + "'>" + url + "</a>";
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
            emailFrequency: 1,
            history: 1
        };
        if (!Permissions.userCan("list-user", "user", this.userId)) {
            if (Permissions.userCan("add-user", "publisher", this.userId)) {
                query.publisherId = Users.findOne({_id: this.userId}).publisherId;
            } else {
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

Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
};

Accounts.validateLoginAttempt(function (attempt) {
    if (Config && Config.isDevMode)//开发模式不检查邮箱是否已验证
        return true;
    if (attempt.user.emails[0].address === "admin@scp.com")//admin user can't be blocked and doesn't need verification
        return true;
    if (attempt.user && attempt.user.disable) {
        throw new Meteor.Error(403, 'user_blocked');
    }
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified)
        throw new Meteor.Error(100002, "email not verified");
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
Meteor.methods({
    registerUser: function (username, password, email) {
        var userId = Accounts.createUser({
            email: email,
            password: password,
            username: username
        });
        Meteor.defer(function () {
            Accounts.sendVerificationEmail(userId);
        });
        return userId;
    },
    parseExcel:function(excelId){
        Meteor.setTimeout(function(){
            if(!excelId) return;

            var excelObj = fileExcel.findOne({_id:excelId});
            if(!excelObj || !excelObj.fileId) return;

            var excelFile = Collections.Excels.findOne({_id:excelObj.fileId},{fields:{copies:1}});
            if(!excelFile || !excelFile.copies || !excelFile.copies.excels || !excelFile.copies.excels.key) return;

            var filePath = Config.uploadExcelDir + "/" + excelFile.copies.excels.key;
            var ext = excelFile.copies.excels.key.toLowerCase().endWith(".xlsx") ? "xlsx":"xls";
            var excel = new Excel(ext);
            var workbook = excel.readFile(filePath);
            var workbookJson = excel.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            for(var i = 0; i < workbookJson.length; i++){
                //console.dir(workbookJson[i]);
                Meteor.call("registerUser", workbookJson[i].username, workbookJson[i].password, workbookJson[i].email, function (err,id) {
                        if (err) return;
                        //var journal =[];
                        //var topic = []
                        ////if(workbookJson[i].journals){
                        ////    journal = workbookJson[i].journals.split(",");
                        ////    var journalsId = Publications.find({issn:{$in:journal}});
                        ////}
                        //if(workbookJson[i].topics){
                        //    topic = workbookJson[i].topics.split(",");
                        //    var topicsId = Topics.find({name:{$in:topic}});
                        //}
                        //console.dir(topicsId._id);
                        Users.update({_id: id}, {$set: {"profile.realname": workbookJson[i].realname , "profile.institution": workbookJson[i].institution, "profile.fieldOfResearch": workbookJson[i].field,
                            "profile.interestedOfJournals": workbookJson[i].journals, "profile.interestedOfTopics": workbookJson[i].topics, "profile.phone": workbookJson[i].phone,
                            "profile.address": workbookJson[i].address, "profile.weChat": workbookJson[i].weChat}});
                    }
                );
            }
        },2000)
    }
});
