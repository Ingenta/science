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
    name: 'FTPSCAN',
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.FTPSCAN.rate || "every 30 minutes");//默认每30分钟检查一次
    },
    job: function () {
        Tasks.scanFTP();
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
        var journalNews = {};
        var homePageNews = homepageNews();

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
                            {'profile.articlesOfInterest': {$exists: 1}},
                            {'profile.journalsOfInterest': {$exists: 1}},
                            {'profile.topicsOfInterest': {$exists: 1}}
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
                else oneUser.lastSentDate = today.toDate();
            }
            if (oneUser.profile.journalsOfInterest && oneUser.profile.journalsOfInterest.length > 0) {
                Issues.find({
                    $and: [
                        {journalId: {$in: oneUser.profile.journalsOfInterest}},
                        {createDate: {$gt: oneUser.lastSentDate}}
                    ]
                }).forEach(function (oneIssue) {
                    if (!issueToArticles[oneIssue._id]) {
                        var articles = Articles.find({
                            journalId: oneIssue.journalId,
                            volume: oneIssue.volume,
                            issue: oneIssue.issue,
                            pubStatus: 'normal'
                        }, {
                            fields: {
                                _id: 1,
                                title: 1,
                                authors: 1,
                                year: 1,
                                volume: 1,
                                issue: 1,
                                elocationId: 1,
                                'journal.titleCn': 1
                            }
                        }).fetch();

                        var journalUrl = Meteor.absoluteUrl(Science.URL.journalDetail(oneIssue.journalId).substring(1));
                        issueToArticles[oneIssue._id] = generateArticleLinks(articles, journalUrl);
                    }

                    if (!journalNews[oneIssue.journalId]) {
                        journalNews[oneIssue.journalId] = journalIdToNews(oneIssue.journalId);
                    }

                    if (issueToArticles[oneIssue._id].length) outgoingList.push({
                        userId: oneUser._id,
                        email: oneUser.emails[0].address,
                        issue: oneIssue
                    });

                    var articleList = Articles.find({
                        $and: [
                            {journalId: {$in: [oneIssue.journalId]}},
                            {createdAt: {$gt: oneUser.lastSentDate}},
                            {$or: [{pubStatus: 'online_first'}, {pubStatus: 'preset'}]}
                        ]
                    }, {
                        fields: {
                            _id: 1,
                            title: 1,
                            authors: 1,
                            year: 1,
                            volume: 1,
                            issue: 1,
                            elocationId: 1,
                            journalId: 1,
                            'journal.titleCn': 1
                        }
                    }).fetch();
                    articleList = generateArticleLinks(articleList);
                    if (articleList.length) outgoingList.push({
                        userId: oneUser._id,
                        email: oneUser.emails[0].address,
                        articleList: articleList
                    });
                });
            }
            if (oneUser.profile.topicsOfInterest && oneUser.profile.topicsOfInterest.length > 0) {
                oneUser.profile.topicsOfInterest.forEach(function (oneTopic) {
                    var articleList = Articles.find({
                        $and: [
                            {topic: {$in: [oneTopic]}},
                            {createdAt: {$gt: oneUser.lastSentDate}},
                            {$or: [{pubStatus: 'normal'}, {pubStatus: 'online_first'}]}
                        ]
                    }, {
                        fields: {
                            _id: 1,
                            title: 1,
                            authors: 1,
                            year: 1,
                            volume: 1,
                            issue: 1,
                            elocationId: 1,
                            journalId: 1,
                            'journal.titleCn': 1
                        }
                    }).fetch();
                    articleList = generateArticleLinks(articleList);
                    if (articleList.length) outgoingList.push({
                        userId: oneUser._id,
                        email: oneUser.emails[0].address,
                        topic: oneTopic,
                        articleList: articleList
                    });
                })
            }
            if (oneUser.profile.articlesOfInterest && oneUser.profile.articlesOfInterest.length > 0) {
                //var tempArray = Articles.find({
                //    $and: [
                //        {_id: {$in: oneUser.profile.articlesOfInterest}},
                //        {createdAt: {$gt: oneUser.lastSentDate}}
                //    ]
                //}, {
                //    fields: {_id: 1, title: 1}
                //}).fetch();

                //if (tempArray.length) outgoingList.push({
                //    userId: oneUser._id,
                //    email: oneUser.emails[0].address,
                //    articleIds: tempArray
                //});

                //var citations = Citations.find({
                //    $and: [
                //        {articleId: {$in: oneUser.profile.articlesOfInterest}},
                //        {createdAt: {$gt: oneUser.lastSentDate}}
                //    ]
                //}).fetch();

                var citations = Citations.aggregate([{
                    $match: {
                        $and: [
                            {articleId: {$in: oneUser.profile.articlesOfInterest}},
                            {createdAt: {$gt: oneUser.lastSentDate}}
                        ]
                    }
                }, {
                    $group: {
                        _id: "$articleId",
                        citations: {$push: "$citation"}
                    }
                }]);

                if (citations.length) outgoingList.push({
                    userId: oneUser._id,
                    userName: oneUser.username,
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
                //var emailTemplate = "";
                if (oneEmail.issue) {
                    //this is an issue watch
                    //emailSubject = "Journal Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchJournal"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    oneEmail.journal = Publications.findOne({_id: oneEmail.issue.journalId}, {
                        fields: {
                            title: 1,
                            titleCn: 1,
                            description: 1,
                            scholarOneCode: 1,
                            magtechCode: 1
                        }
                    });
                    oneEmail.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(oneEmail.issue.journalId).substring(1));
                    oneEmail.journal.mostRead = Meteor.absoluteUrl("mostReadArticles/" + oneEmail.issue.journalId);
                    oneEmail.issue.url = Meteor.absoluteUrl(Science.URL.issueDetail(oneEmail.issue._id).substring(1));
                    oneEmail.articleList = issueToArticles[oneEmail.issue._id];
                    oneEmail.journalNews = journalNews[oneEmail.issue.journalId];
                    Science.Email.watchJournalEmail(oneEmail);

                } else if (oneEmail.topic) {
                    //this is a topic watch
                    //emailSubject = "Topic Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchTopic"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    oneEmail.topic = Topics.findOne({_id: oneEmail.topic});
                    oneEmail.homePageNews = homePageNews;
                    Science.Email.watchTopicEmail(oneEmail);
                    //oneEmail.articleIds.forEach(function (article) {
                    //    emailContent += createEmailArticleListContent(article);
                    //})
                } else if (oneEmail.citations) {
                    //this is cited alert
                    //emailSubject = "Cited Alert";
                    //emailConfig = EmailConfig.findOne({key: "citedAlert"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    //emailContent += createEmailCitedArticleContent(oneEmail.citations);
                    Science.Email.watchArticleCitationAlertEmail(oneEmail);
                } else {
                    //this is an article watch
                    //emailSubject = "Article Watch";
                    //emailConfig = EmailConfig.findOne({key: "watchArticle"});
                    //if (emailConfig) {
                    //    emailSubject = emailConfig.subject;
                    //    emailContent = emailConfig.body;
                    //}
                    Science.Email.availableOnline(oneEmail);
                }

                //Email.send({
                //    to: oneEmail.email,
                //    from: 'publish@scichina.org',
                //    subject: emailSubject,
                //    html: emailContent
                //});
                logger.silly("email sent");
                //Users.update({_id: oneEmail.userId}, {lastSentDate: today.toDate()});
            });
        } else {
            logger.silly('watch email task ran but email list was empty, no emails sent.');
        }
        Science.Email.searchFrequencyEmail();
        //Science.Email.authorCitationAlertEmail();
    }
});

var abortUnfinishTask = function () {
    AutoTasks.update({status: {$nin: ["ended", "aborted"]}}, {$set: {status: "aborted", processing: 0}}, {multi: true});
};

Meteor.startup(function () {
    abortUnfinishTask();
    SyncedCron.config({
        logger: function (opts) {
            logger.log(opts.level, opts.message, opts.tag)
        }
    });
    if (Config.AutoTasks.start)
        SyncedCron.start();
});

var generateArticleLinks = function (articles, journalUrl) {
    articles.forEach(function (article) {
        if (article._id)
            article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
        if (journalUrl)
            article.journal.url = journalUrl;
        else
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
    });
    return articles;
};

var journalIdToNews = function (journalId) {
    var news = {};
    news.newsCenter = News.find({publications: journalId, about: 'a1'}, {sort: {createDate: -1}, limit: 3}).fetch();
    news.publishingDynamic = News.find({publications: journalId, about: 'b1'}, {
        sort: {createDate: -1},
        limit: 3
    }).fetch();
    news.meetingInfo = Meeting.find({publications: journalId, about: 'c1'}, {sort: {createDate: -1}, limit: 3}).fetch();
    var rootUrl = Config.rootUrl;
    news.newsCenter.forEach(function (item) {
        if (!item.url) item.url = rootUrl + "news/" + item._id
    });
    news.meetingInfo.forEach(function (item) {
        item.startDate = moment(item.startDate).format("MMM Do YYYY");
    });
    return news;
};

var homepageNews = function () {
    var news = News.find({types: '1'}, {sort: {createDate: -1}}).fetch();
    var rootUrl = Config.rootUrl;
    news.forEach(function (item) {
        if (!item.url) item.url = rootUrl + "news/" + item._id
    });
    return news;
};

var createEmailArticleListContent = function (article) {
    if (!article._id)return article.title.cn;
    var url = Science.URL.articleDetail(article._id);
    if (!url)return article.title.cn;
    return "<a href=\"" + Meteor.absoluteUrl(url.substring(1)) + "\">" + article.title.cn + "</a>" + "\n\n";
};

//var createEmailCitedArticleContent = function (citations) {
//    var citationMap = {};
//    citations.forEach(function (oneCitation) {
//        if(citationMap[oneCitation.doi])
//            citationMap[oneCitation.doi].push(oneCitation.citation);
//        else
//            citationMap[oneCitation.doi] = [oneCitation.citation];
//    });
//    var content = "";
//    Object.keys(citationMap).forEach(function (doi) {
//        content += "<ul>" + createEmailArticleListContent(Articles.findOne({doi: doi}, {fields: {_id: 1, title: 1}})) + " Cited by:";
//        citationMap[doi].forEach(function (oneCitation) {
//            if (!oneCitation.doi)
//                content += "<li>" + oneCitation.journal.title + "</li>";
//            else
//                content += "<li><a href=\"http://dx.doi.org/" + oneCitation.doi + "\">" + oneCitation.journal.title + "</a></li>" + "\n\n";
//        })
//    });
//    return content + "</ul>";
//};