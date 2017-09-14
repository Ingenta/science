Meteor.startup(function () {
    var smtp = {
        username: Config.mailServer.address,   // eg: server@gentlenode.com
        password: Config.mailServer.password,   // eg: 3eeP1gtizk5eziohfervU
        server: Config.mailServer.server,  // eg: mail.gandi.net
        port: Config.mailServer.port
    }
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
    Accounts.emailTemplates.from = 'SciEngine <' + Config.mailServer.address + '>';

    // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
    Accounts.emailTemplates.siteName = '《中国科学》杂志社平台 Science China Publishing';


    // A Function that takes a user object and returns a String for the subject line of the email.
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
        return EmailConfig.findOne({key: "verifyEmail"}).subject;
    };

    // A Function that takes a user object and a url, and returns the body text for the email.
    // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html

    Accounts.emailTemplates.verifyEmail.html = function (user, url) {
        return JET.render('userEmail', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "content": {
                "body": EmailConfig.findOne({key: "verifyEmail"}).body,
                "url": url
            }
        })
    };

    Accounts.emailTemplates.resetPassword.subject = function (user) {
        return EmailConfig.findOne({key: "forgotPassword"}).subject;
    };

    Accounts.emailTemplates.resetPassword.html = function (user, url) {
        return JET.render('userEmail', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "content": {
                "body": EmailConfig.findOne({key: "forgotPassword"}).body,
                "url": url
            }
        })
    };

    Accounts.emailTemplates.enrollAccount.subject = function (user) {
        return EmailConfig.findOne({key: "registration"}).subject;
    };

    Accounts.emailTemplates.enrollAccount.html = function (user, url) {
        return JET.render('userEmail', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "content": {
                "body": EmailConfig.findOne({key: "registration"}).body,
                "url": url
            }
        })
    };

});

//override default publish
Meteor.publish(allUsers, function () {
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
            institutionId: 1,
            publisherId: 1,
            journalId: 1,
            emailFrequency: 1,
            history: 1,
            level:1
        };
        if(process.env.HIDE_USER_LIST) {
            query._id = this.userId;
            return Meteor.users.find(query, {fields: fields});
        }
        var scope = Permissions.getPermissionRange(this.userId,"user:list-user");
        if (Permissions.userCan("list-user", "user", this.userId, scope)) {
            var scopeQuery = [];
            _.each(scope,function(val,key){
                val = _.isArray(val)?val:[val];
                if(key==='publisher'){
                    scopeQuery.push({publisherId : {$in:val}});
                    scopeQuery.push({_id:this.userId})
                }else if(key==='institution'){
                    scopeQuery.push({institutionId : {$in:val}});
                    scopeQuery.push({_id:this.userId})
                }
            });
            if(!_.isEmpty(scopeQuery))
                query.$or=scopeQuery;
        } else {
            query._id = this.userId;
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
    if (!Config && !Config.isDevMode){ //开发模式不检查邮箱是否已验证
        if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified)
            throw new Meteor.Error(100002, "email_not_verified");
    }
    if (attempt.user && attempt.user.username === "admin")//admin user can't be blocked and doesn't need verification
        return true;
    if (attempt.user && attempt.user.disable) {
        throw new Meteor.Error(403, "user_blocked");
    }

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
    user.level = options.level || Permissions.level.normal
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
    upsertSearchFolder: function (doc) {
        var history = Meteor.user().history;
        if (!history) history = {saved: [], unsaved: []};
        if (!history.saved) history.saved = [];
        if (!_.find(history.saved, function (dir) {
                return dir.folderName === doc.folderName
            })) {
            history.saved.push({folderName: doc.folderName})
            Users.update({_id: Meteor.userId()}, {$set: {"history": history}});
            return true;
        }
        return false;
    },
    parseExcel: function (excelId) {
        Meteor.setTimeout(function () {
            if (!excelId) return;

            var excelObj = fileExcel.findOne({_id: excelId});
            if (!excelObj || !excelObj.fileId) return;

            var excelFile = Collections.Excels.findOne({_id: excelObj.fileId}, {fields: {copies: 1}});
            if (!excelFile || !excelFile.copies || !excelFile.copies.excels || !excelFile.copies.excels.key) return;

            var filePath = Config.tempFiles.uploadExcelDir + "/" + excelFile.copies.excels.key;
            var ext = excelFile.copies.excels.key.toLowerCase().endWith(".xlsx") ? "xlsx" : "xls";
            var excel = new Excel(ext);
            var workbook = excel.readFile(filePath);
            var workbookJson = excel.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            for (var i = 0; i < workbookJson.length; i++) {
                Meteor.call("registerUser", workbookJson[i].username, workbookJson[i].password, workbookJson[i].email, function (err, id) {
                        if (err) return;
                        var journal = [];
                        var topic = []
                        if (workbookJson[i].journals) {
                            _.map(workbookJson[i].journals.split(","), function (item) {
                                var journals = Publications.find({issn: item.trim()}, {_id: 1}).fetch();
                                if(journals){
                                    _.each(journals, function (item) {
                                        journal.push(item._id);
                                    });
                                }
                            });
                        }
                        if (workbookJson[i].topics) {
                            _.map(workbookJson[i].topics.split(","), function (item) {
                                var topics = Topics.find({name: item.trim()}, {_id: 1}).fetch();
                                if(topics){
                                    _.each(topics, function (item) {
                                        topic.push(item._id);
                                    });
                                }
                            });
                        }
                        Users.update({_id: id}, {
                            $set: {
                                "profile.realName": workbookJson[i].realName,
                                "profile.institution": workbookJson[i].institution,
                                "profile.fieldOfResearch": workbookJson[i].field,
                                "profile.journalsOfInterest": journal,
                                "profile.topicsOfInterest": topic,
                                "profile.phone": workbookJson[i].phone,
                                "profile.address": workbookJson[i].address,
                                "profile.weChat": workbookJson[i].weChat
                            }
                        });
                    }
                );
            }
        }, 2000)
    },
    changeUsersPass:function(userId,newPass){
        if(!Permissions.userCan("modify-user","user",Meteor.userId()))
            return "permission deny";
        check(userId, String);
        check(newPass, String);
        return Accounts.setPassword(userId,newPass);
    },
    changeUserLevel:function(userId,newlevel){
        if(!Permissions.userCan("modify-user","user",Meteor.userId()))
            return "permission deny";
        check(userId, String);
        check(newlevel, String);
        Meteor.users.update({_id:userId},{$set:{level:newlevel,orbit_roles:null}});
        return true;
    }
});
