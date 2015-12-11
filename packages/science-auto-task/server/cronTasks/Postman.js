SyncedCron.add({
    name: "Postman",
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.Postman.rate || "at 4:00 am");
    },
    job: function () {


        var outgoingList = [];
        var issueToArticles = {};
        var journalNews = {};
        var homePageNews = homepageNews();
        //getting important dates
        var today = moment().startOf('day');
        var yesterday = moment(today).subtract(1, 'days').toDate();
        var lastWeek = moment(today).subtract(7, 'days').toDate();
        var lastMonth = moment(today).subtract(1, 'months').toDate();
        //getting users by frequency setting
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
        //send appropriate emails for each user
        userList.forEach(function (oneUser) {
            //if they never sent an email then set now as last sent time
            if (!oneUser.lastSentDate) {
                if (oneUser.emailFrequency == 'daily') oneUser.lastSentDate = yesterday;
                else if (oneUser.emailFrequency == 'weekly') oneUser.lastSentDate = lastWeek;
                else if (oneUser.emailFrequency == 'monthly') oneUser.lastSentDate = lastMonth;
                else oneUser.lastSentDate = today.toDate();
            }
            //check this users journal watch and get all the data for TOC
            if (oneUser.profile.journalsOfInterest && oneUser.profile.journalsOfInterest.length > 0) {
                //Issues.find({
                //    $and: [
                //        {journalId: {$in: oneUser.profile.journalsOfInterest}},
                //        {createDate: {$gt: oneUser.lastSentDate}}
                //    ]
                //}).forEach(function (oneIssue) {
                //    if (!issueToArticles[oneIssue._id]) {
                //        var articles = Articles.find({
                //            journalId: oneIssue.journalId,
                //            volume: oneIssue.volume,
                //            issue: oneIssue.issue,
                //            pubStatus: 'normal'
                //        }, {
                //            fields: {
                //                _id: 1,
                //                title: 1,
                //                authors: 1,
                //                year: 1,
                //                volume: 1,
                //                issue: 1,
                //                elocationId: 1,
                //                'journal.titleCn': 1
                //            }
                //        }).fetch();
                //
                //        var journalUrl = Meteor.absoluteUrl(Science.URL.journalDetail(oneIssue.journalId).substring(1));
                //        issueToArticles[oneIssue._id] = generateArticleLinks(articles, journalUrl);
                //    }
                //
                //    if (!journalNews[oneIssue.journalId]) {
                //        journalNews[oneIssue.journalId] = journalIdToNews(oneIssue.journalId);
                //    }
                //
                //    if (issueToArticles[oneIssue._id].length) outgoingList.push({
                //        userId: oneUser._id,
                //        email: oneUser.emails[0].address,
                //        issue: oneIssue
                //    });
                //});
                //get all the data for available online
                //oneUser.profile.journalsOfInterest.forEach(function (journalId) {
                //    var articleList = Articles.find({
                //        $and: [
                //            {journalId: {$in: [journalId]}},
                //            {createdAt: {$gt: oneUser.lastSentDate}},
                //            {$or: [{pubStatus: 'online_first'}, {pubStatus: 'accepted'}]}
                //        ]
                //    }, {
                //        fields: {
                //            _id: 1,
                //            title: 1,
                //            authors: 1,
                //            year: 1,
                //            volume: 1,
                //            issue: 1,
                //            elocationId: 1,
                //            journalId: 1,
                //            'journal.titleCn': 1
                //        }
                //    }).fetch();
                //    articleList = generateArticleLinks(articleList);
                //    if (articleList.length) outgoingList.push({
                //        userId: oneUser._id,
                //        email: oneUser.emails[0].address,
                //        articleList: articleList
                //    });
                //});
            }
            //check topic watch and get all data
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
            //check watch article and get all citations from article this user is watching
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

        //check has outgoing and send each of them

        if (outgoingList.length) {
            outgoingList.forEach(function (oneEmail) {
                if (oneEmail.issue) {
                    //this is an issue watch
                    //oneEmail.journal = Publications.findOne({_id: oneEmail.issue.journalId}, {
                    //    fields: {
                    //        title: 1,
                    //        titleCn: 1,
                    //        description: 1,
                    //        scholarOneCode: 1,
                    //        magtechCode: 1
                    //    }
                    //});
                    //oneEmail.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(oneEmail.issue.journalId).substring(1));
                    //oneEmail.journal.mostRead = Meteor.absoluteUrl("mostReadArticles/" + oneEmail.issue.journalId);
                    //oneEmail.issue.url = Meteor.absoluteUrl(Science.URL.issueDetail(oneEmail.issue._id).substring(1));
                    //oneEmail.articleList = issueToArticles[oneEmail.issue._id];
                    //oneEmail.journalNews = journalNews[oneEmail.issue.journalId];
                    //Science.Email.watchJournalEmail(oneEmail);

                } else if (oneEmail.topic) {
                    //this is a topic watch
                    oneEmail.topic = Topics.findOne({_id: oneEmail.topic});
                    oneEmail.homePageNews = homePageNews;
                    //Science.Email.watchTopicEmail(oneEmail);
                } else if (oneEmail.citations) {
                    //this is cited alert
                    //Science.Email.watchArticleCitationAlertEmail(oneEmail);
                } else {
                    //this is an article watch
                    //Science.Email.availableOnline(oneEmail);
                }


                logger.silly("email sent");
                //Users.update({_id: oneEmail.userId}, {lastSentDate: today.toDate()});
            });
        } else {
            logger.silly('watch email task ran but email list was empty, no emails sent.');
        }
        //Science.Email.searchFrequencyEmail();
        //Science.Email.authorCitationAlertEmail();
    }
});

//var generateArticleLinks = function (articles, journalUrl) {
//    articles.forEach(function (article) {
//        if (article._id)
//            article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
//        if (journalUrl)
//            article.journal.url = journalUrl;
//        else
//            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
//    });
//    return articles;
//};
//
//var journalIdToNews = function (journalId) {
//    var news = {};
//    news.newsCenter = News.find({publications: journalId, about: 'a1'}, {sort: {createDate: -1}, limit: 3}).fetch();
//    news.publishingDynamic = News.find({publications: journalId, about: 'b1'}, {
//        sort: {createDate: -1},
//        limit: 3
//    }).fetch();
//    news.meetingInfo = Meeting.find({publications: journalId, about: 'c1'}, {sort: {createDate: -1}, limit: 3}).fetch();
//    var rootUrl = Config.rootUrl;
//    news.newsCenter.forEach(function (item) {
//        if (!item.url) item.url = rootUrl + "news/" + item._id
//    });
//    news.meetingInfo.forEach(function (item) {
//        item.startDate = moment(item.startDate).format("MMM Do YYYY");
//    });
//    return news;
//};

var homepageNews = function () {
    var news = News.find({types: '1'}, {sort: {createDate: -1}}).fetch();
    var rootUrl = Config.rootUrl;
    news.forEach(function (item) {
        if (!item.url) item.url = rootUrl + "news/" + item._id
    });
    return news;
};
