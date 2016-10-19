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
        check(values.reasons,String);
        check(values.recipient,String);
        check(values.sender,String);
        var emails=[];

        if(!_.isEmpty(values.recipient)){
            var recipientArr = values.recipient.split(';');
            emails = _.union(emails,recipientArr);
        }

        if(_.isEmpty(emails))return;

        var senderEmail = values.sender;
        var user="";
        if (Meteor.user() && Meteor.user().profile)
            if (Meteor.user().profile.realName)
                user = Meteor.user().profile.realName;

        if (values.reasons === undefined)values.reasons = "";

        var article = Articles.findOne({
            doi: values.doi
        }, {
            fields: {
                _id: 1,
                title: 1,
                authors: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                endPage:1,
                journalId: 1,
                'journal.title': 1,
                'journal.titleCn': 1,
                doi:1,
                pdfId:1,
                contentType:1,
                sections:1,
                special:1,
                topic:1,
                language:1
            }
        });
        article.url = values.url;
        if(!article.journal) article.journal = {};
        article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
        article.journal.pdfUrl = Config.rootUrl;
        if(article.contentType){
            var articleType = ContentType.findOne({subject:article.contentType});
            if(articleType)
                article.contentType = articleType.name.en;
        }
        if(article.topic){
            var topicId;
            if(_.isArray(article.topic) && !_.isEmpty(article.topic)){
                topicId = article.topic[0];
            } else if(_.isString(article.topic)){
                topicId = article.topic;
            }
            var topic = Topics.findOne({_id:topicId});
            article.topic = topic && topic.englishName;
        }
        var author = [];
        article.authors.forEach(function (item) {
            if (!item.authors) {
                author.push(item.fullname.en);
            }
        });
        article.authorFullName = author.join(", ");
        var emailSubject = user+'<'+ senderEmail + '> has sent you an article';

        Meteor.defer(function () {
            _.each(emails,function(email){
                Email.send({
                    to: email,
                    from: Config.mailServer.address,
                    subject: emailSubject,
                    html: JET.render('emailThis', {
                        "user": user,
                        "senderEmail":senderEmail,
                        "reason": values.reasons,
                        "articleList": [article],
                        "scpLogoUrl": Config.rootUrl + "email/logo.png",
                        "rootUrl": Config.rootUrl
                    })
                });
            });
        });

    },
    broadcastEmail: function (values) {
        Meteor.defer(function () {
            var emails=[];
            if(!_.isEmpty(values.userLevel)){
                if(values.userLevel.indexOf('publisher')>-1)
                    values.userLevel.push("journal");
                var reciveUsers = Meteor.users.find({"emails.verified":true,level:{$in:values.userLevel}},{fields:{emails:1}});
                if(reciveUsers.count()>0){
                    reciveUsers.forEach(function(user){
                        if(!_.isEmpty(user.emails) && user.emails[0].address)
                            emails.push(user.emails[0].address)
                    })
                }
            }
            if(!_.isEmpty(values.recipient)){
                var recipientArr = values.recipient.split(';');
                emails = _.union(emails,recipientArr);
            }

            if(_.isEmpty(emails))
                return;

            var content = JET.render('broadcastEmail', {
                "subject": values.subject,
                "content": values.content,
                "scpLogoUrl": Config.rootUrl + "email/logo.png",
                "rootUrl": Config.rootUrl
            })
            _.each(emails,function(email){
                Email.send({
                    to: email,
                    from: Config.mailServer.address,
                    subject: values.subject,
                    html: content
                });
            })
        });
    }
});