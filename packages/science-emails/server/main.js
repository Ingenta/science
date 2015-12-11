Science.Email = {};

Science.Email.authorCitationAlertEmail = function () {
    Citations.aggregate([{
        $match: {
            createdAt: {$gt: moment().startOf('day').toDate()}
        }
    }, {
        $group: {
            _id: "$articleId",
            citations: {$push: "$citation"}
        }
    }]).forEach(function (item) {
        var emailConfig = EmailConfig.findOne({key: "articleCitedAlert"});
        var article = Articles.findOne({_id: item._id}, {
            fields: {
                title: 1,
                authors: 1,
                authorNotes: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                'journal.titleCn': 1
            }
        });
        article.authorNotes.forEach(function (address) {
            var authorName = _.find(article.authors, function (obj) {
                return obj.email === address.id;
            });
            Email.send({
                to: address.email,
                from: Config.mailServer.address,
                subject: emailConfig ? emailConfig.subject : 'Article has been cited',
                html: JET.render('citationAlertEmail', {
                    "article": article,
                    "authorName": authorName,
                    "citations": item.citations,
                    "scpLogoUrl": Config.rootUrl + "email/logo.png",
                    "rootUrl": Config.rootUrl
                })
            });
            logger.silly("citation alert email sent");
        });
    })
};

Science.Email.searchFrequencyEmail = function () {
    var topicNames = [];
    Topics.find({}, {fields: {name: 1, englishName: 1}}).forEach(function (ondTopic) {
        if (ondTopic.name) topicNames.push(ondTopic.name);
        if (ondTopic.englishName) topicNames.push(ondTopic.englishName);
    });
    var searchLogs = SearchLog.find({
        str: {$nin: topicNames},
        count: {$gte: Config.searchKeywordFrequency}
    }).fetch();
    if (searchLogs.length) {
        var emailConfig = EmailConfig.findOne({key: "keywordFrequency"});
        Email.send({
            to: Users.findOne({username: Config.sysAdmin}).emails[0].address,
            from: Config.mailServer.address,
            subject: emailConfig ? emailConfig.subject : 'Search Keyword Frequency Reached',
            html: JET.render('searchFrequency', {
                "searchLogs": searchLogs,
                "scpLogoUrl": Config.rootUrl + "email/logo.png",
                "rootUrl": Config.rootUrl
            })

        });
        logger.silly("search frequency email sent");
        searchLogs.forEach(function (entry) {
            SearchLog.update({_id: entry._id}, {$set: {count: 0}});
        });
    }
};

Science.Email.tableOfContentEmail = function (yesterday) {
    Issues.find({createDate: {$gt: yesterday}}).forEach(function (oneIssue) {
        var articleList = Articles.find({
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
        if (!articleList.length) return;

        var journal = Publications.findOne({_id: oneIssue.journalId}, {
            fields: {
                title: 1,
                titleCn: 1,
                description: 1,
                banner: 1,
                scholarOneCode: 1,
                magtechCode: 1
            }
        });
        if(!journal) return;

        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(oneIssue.journalId).substring(1));
        journal.mostRead = Meteor.absoluteUrl("mostReadArticles/" + oneIssue.journalId);
        if (journal.banner) journal.banner = Meteor.absoluteUrl(Images.findOne({_id: journal.banner}).url().substring(1));
        generateArticleLinks(articleList, journal.url);

        oneIssue.url = Meteor.absoluteUrl(Science.URL.issueDetail(oneIssue._id).substring(1));

        var journalNews = journalIdToNews(oneIssue.journalId);

        var content = JET.render('watchJournal', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "emailIcoUrl": Config.rootUrl + "email/ico.png",
            "rootUrl": Config.rootUrl,
            "issue": oneIssue,
            "journal": journal,
            "articleList": articleList,
            "journalNews": journalNews
        });

        Users.find({'profile.journalsOfInterest': {$in: [oneIssue.journalId]}}).forEach(function (oneUser) {
            Email.send({
                to: oneUser.emails[0].address,
                from: Config.mailServer.address,
                subject: journal.titleCn + " 更新第" + oneIssue.issue + "期",
                html: content
            });
        });
    });
};

Science.Email.availableOnline = function (lastWeek) {
    Articles.aggregate([{
        $match: {
            $and: [
                {pubStatus: 'online_first'},
                {createdAt: {$gt: lastWeek}}
            ]
        }
    }, {
        $group: {
            _id: "$journalId",
            articleList: {$push:  {
                _id: "$_id",
                title: "$title",
                authors: "$authors",
                year: "$year:",
                volume: "$volume",
                issue: "$issue",
                elocationId: "$elocationId",
                journalId: "$journalId",
                journal: "$journal"
            }}
        }
    }]).forEach(function (obj) {
        var journal = {};
        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(obj._id).substring(1));
        journal.banner = Publications.findOne({_id: obj._id},{fields: {banner: 1}}).banner;
        if (journal.banner) journal.banner = Meteor.absoluteUrl(Images.findOne({_id: journal.banner}).url().substring(1));
        generateArticleLinks(obj.articleList, journal.url);

        var content = JET.render('availableOnline', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "onlineUrl": Config.rootUrl + "email/online.jpg",
            "rootUrl": Config.rootUrl,
            "journal": journal,
            "articleList": obj.articleList
        });
        Users.find({'profile.journalsOfInterest': {$in: [obj._id]}}).forEach(function (oneUser) {
            Email.send({
                to: oneUser.emails[0].address,
                from: Config.mailServer.address,
                subject: "Available Online Now",
                html: content
            });
        });
    });
};

Science.Email.watchTopicEmail = function (oneEmail) {
    Email.send({
        to: oneEmail.email,
        from: Config.mailServer.address,
        subject: oneEmail.topic.name + "下有文章更新",
        html: JET.render('watchTopic', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "topic": oneEmail.topic,
            "articleList": oneEmail.articleList,
            "homePageNews": oneEmail.homePageNews
        })
    });
};

Science.Email.watchArticleCitationAlertEmail = function (oneEmail) {
    oneEmail.citations.forEach(function (item) {
        var emailConfig = EmailConfig.findOne({key: "articleCitedAlert"});
        var article = Articles.findOne({_id: item._id}, {
            fields: {
                title: 1,
                authors: 1,
                authorNotes: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                'journal.titleCn': 1
            }
        });
        Email.send({
            to: oneEmail.email,
            from: Config.mailServer.address,
            subject: emailConfig ? emailConfig.subject : 'Article has been cited',
            html: JET.render('citationAlertEmail', {
                "article": article,
                "userName": oneEmail.userName,
                "citations": item.citations,
                "scpLogoUrl": Config.rootUrl + "email/logo.png",
                "rootUrl": Config.rootUrl
            })
        });
    })
};

Science.Email.test = function (template, theData) {
    Email.send({
        to: "dongdong.yang@digitalpublishing.cn",
        from: Config.mailServer.address,
        subject: 'test',
        html: JET.render(template, theData)
    });
    console.log('waiting for email');
};

var generateArticleLinks = function (articles, journalUrl) {
    articles.forEach(function (article) {
        if (article._id)
            article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
        if (journalUrl)
            article.journal.url = journalUrl;
        else
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
    });
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
