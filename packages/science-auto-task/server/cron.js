SyncedCron.add({
    name: 'DOIRegister',
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.DOI_Register.rate || "at 1:00 am");//默认每天凌晨1点执行
    },
    job: function () {
        var taskId = AutoTasks.insert({type: "doi_register", status: "creating", createOn: new Date()});
        Science.Interface.CrossRef.register({
            taskId: taskId,
            recvEmail: Config.AutoTasks.DOI_Register.recvEmail,
            rootUrl: Config.AutoTasks.DOI_Register.rootUrl,
            condition: Config.AutoTasks.DOI_Register.condition
        });
    }
});

SyncedCron.add({
    name: "CitationsUpdate",
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.Citation.rate || "at 1:00 am except on Sat");//默认每周六凌晨1点执行
    },
    job: function () {
        Science.Queue.Citation.reset();
        var taskId = AutoTasks.insert({type: "update_citation", status: "creating", createOn: new Date()});

        var articles = Articles.find({}, {fields: {doi: 1}});
        var index = 0;
        articles.forEach(function (item) {
            var stId = SubTasks.insert({
                taskId: taskId,
                doi: item.doi,
                index: index++,
                status: "pending",
                createOn: new Date()
            });
            Science.Queue.Citation.add({id: stId, taskId: taskId, doi: item.doi, articleId: item._id});
        });
        //var item = {doi:'10.1360/972010-666'};
        //for(var ii=0;ii<100;ii++){
        //	var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
        //	Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
        //}
        AutoTasks.update({_id: taskId}, {$set: {status: "created", total: articles.count()}});
        Science.Queue.Citation.taskId = taskId;
        //SyncedCron.stop();
    }
});

SyncedCron.add({
    name: "SendAlertEmail",
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.Send_Alert_Email.rate || "at 4:00 am");
    },
    job: function () {
        var outgoingList = [];
        var issueToArticles = {};

        var today = moment().startOf('day');
        var yesterday = moment(today).subtract(1, 'days').toDate();
        var lastWeek = moment(today).subtract(7, 'days').toDate();
        var lastMonth = moment(today).subtract(1, 'months').toDate();

        var userList = Users.find(
            {
                $and: [
                    {
                        $or: [
                            {$and: [{emailFrequency: {$exists: 1}}, {lastSentDate: {$exists: 0}}]},
                            {$and: [{emailFrequency: 'daily'}, {lastSentDate: {$lt: yesterday}}]},
                            {$and: [{emailFrequency: 'weekly'}, {lastSentDate: {$lt: lastWeek}}]},
                            {$and: [{emailFrequency: 'monthly'}, {lastSentDate: {$lt: lastMonth}}]}
                        ]
                    }, {
                        $or: [
                            {'profile.interestedOfArticles': {$exists: 1}},
                            {'profile.interestedOfJournals': {$exists: 1}},
                            {'profile.interestedOfTopics': {$exists: 1}}
                        ]
                    }
                ]
            }
        );
        userList.forEach(function (oneUser) {
            if (!oneUser.lastSentDate) {
                if (oneUser.emailFrequency == 'daily') oneUser.lastSentDate = yesterday;
                else if (oneUser.emailFrequency == 'weekly') oneUser.lastSentDate = lastWeek;
                else if (oneUser.emailFrequency == 'monthly') oneUser.lastSentDate = lastMonth;
                else oneUser.lastSentDate = new Date();
            }
            if (oneUser.profile.interestedOfJournals && oneUser.profile.interestedOfJournals.length > 0) {
                Issues.find({
                    $and: [
                        {journalId: {$in: oneUser.profile.interestedOfJournals}},
                        {createDate: {$gt: oneUser.lastSentDate}}
                    ]
                }).forEach(function (oneIssue) {
                    if (!issueToArticles[oneIssue._id])
                        issueToArticles[oneIssue._id] = Articles.find({
                            journalId: oneIssue.journalId,
                            volume: oneIssue.volume,
                            issue: oneIssue.issue,
                            pubStatus: 'normal'
                        }, {
                            fields: {_id: 1, title: 1}
                        }).fetch();
                    if (issueToArticles[oneIssue._id].length) outgoingList.push({
                        userId: oneUser._id,
                        email: oneUser.emails[0].address,
                        issue: oneIssue
                    });
                });
            }
            if (oneUser.profile.interestedOfTopics && oneUser.profile.interestedOfTopics.length > 0) {
                oneUser.profile.interestedOfTopics.forEach(function (oneTopic) {
                    var tempArray = Articles.find({
                        $and: [
                            {topic: {$in: [oneTopic]}},
                            {createdAt: {$gt: oneUser.lastSentDate}},
                            {$or: [{pubStatus: 'normal'}, {pubStatus: 'online_first'}]}
                        ]
                    }, {
                        fields: {_id: 1, title: 1}
                    }).fetch();
                    if (tempArray.length) outgoingList.push({
                        userId: oneUser._id,
                        email: oneUser.emails[0].address,
                        topicId: oneTopic,
                        articleIds: tempArray
                    });
                })
            }
            if (oneUser.profile.interestedOfArticles && oneUser.profile.interestedOfArticles.length > 0) {
                var tempArray = Articles.find({
                    $and: [
                        {_id: {$in: oneUser.profile.interestedOfArticles}},
                        {createdAt: {$gt: oneUser.lastSentDate}}
                    ]
                }, {
                    fields: {_id: 1, title: 1}
                }).fetch();

                if (tempArray.length) outgoingList.push({
                    userId: oneUser._id,
                    email: oneUser.emails[0].address,
                    articleIds: tempArray
                });

                var citations = Citations.find({
                    $and: [
                        {articleId: {$in: oneUser.profile.interestedOfArticles}},
                        {createdAt: {$gt: oneUser.lastSentDate}}
                    ]
                }).fetch();

                if(citations.length) outgoingList.push({
                    userId: oneUser._id,
                    email: oneUser.emails[0].address,
                    citations: citations
                });
            }
        });

        //TODO: refactor into methods and retest

        if (outgoingList.length) {
            outgoingList.forEach(function (oneEmail) {
                var emailSubject = "";
                var emailContent = "";
                //var emailConfig = undefined;
                var emailTemplate = "";
                if (oneEmail.issue) {
                    //this is an issue watch
                    emailSubject = "Issue Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchJournal"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    issueToArticles[oneEmail.issue._id].forEach(function (article) {
                        emailContent += createEmailArticleListContent(article);
                    });
                } else if (oneEmail.topicId) {
                    //this is a topic watch
                    emailSubject = "Topic Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchTopic"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    oneEmail.articleIds.forEach(function (article) {
                        emailContent += createEmailArticleListContent(article);
                    })
                } else if(oneEmail.citations){
                    //this is cited alert
                    emailSubject = "Cited Alert";
                    //emailConfig = EmailConfig.findOne({key: "citedAlert"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    emailContent += createEmailCitedArticleContent(oneEmail.citations);
                } else {
                    //this is an article watch
                    emailSubject = "Article Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchArticle"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    if(oneEmail.articleIds){
                        oneEmail.articleIds.forEach(function (article) {
                            emailContent += createEmailArticleListContent(article);
                        })
                    }
                }

                //Email.send({
                //    to: oneEmail.email,
                //    from: 'publish@scichina.org',
                //    subject: emailSubject,
                //    html: emailContent
                //});
                //Users.update({_id: oneEmail.userId}, {lastSentDate: today});
            });
        } else {
            console.log('watch email task ran but email list was empty, no emails sent.');
        }
        Science.Email.searchFrequencyEmail();
    }
});

var abortUnfinishTask = function () {
    AutoTasks.update({status: {$nin: ["ended", "aborted"]}}, {$set: {status: "aborted", processing: 0}}, {multi: true});
};

Meteor.startup(function () {
    abortUnfinishTask();
    if (Config.AutoTasks.start)
        SyncedCron.start();
});


var createEmailArticleListContent = function (article) {
    if (!article)return article.title.cn;
    if (!article._id)return article.title.cn;
    var url = Science.URL.articleDetail(article._id);
    if (!url)return article.title.cn;
    return "<a href=\"" + Meteor.absoluteUrl(url.substring(1)) + "\">" + article.title.cn + "</a>" + "\n\n";
};

var createEmailCitedArticleContent = function (citations) {
    var citationMap = {};
    citations.forEach(function (oneCitation) {
        if(citationMap[oneCitation.doi])
            citationMap[oneCitation.doi].push(oneCitation.citation);
        else
            citationMap[oneCitation.doi] = [oneCitation.citation];
    });
    var content = "";
    Object.keys(citationMap).forEach(function (doi) {
        content += "<ul>" + createEmailArticleListContent(Articles.findOne({doi: doi}, {fields: {_id: 1, title: 1}})) + " Cited by:";
        citationMap[doi].forEach(function (oneCitation) {
            if (!oneCitation.doi)
                content += "<li>" + oneCitation.journal.title + "</li>";
            else
                content += "<li><a href=\"http://dx.doi.org/" + oneCitation.doi + "\">" + oneCitation.journal.title + "</a></li>" + "\n\n";
        })
    });
    return content + "</ul>";
};