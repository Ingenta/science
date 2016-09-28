Science.Email = {};

Science.Email.authorCitationAlertEmail = function (date) {
    var emailConfig = EmailConfig.findOne({key: "articleCitedAlert"});
    Citations.aggregate([{
        $match: {
            createdAt: {$gt: date}
        }
    }, {
        $group: {
            _id: "$doi",
            citations: {$push: "$citation"}
        }
    }]).forEach(function (item) {
        var article = Articles.findOne({doi: item._id}, {
            fields: {
                title: 1,
                authors: 1,
                authorNotes: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                journalId: 1,
                journal: 1
            }
        });
        if(!article) return;
        article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
        if(article.journalId) {
            article.journal = Publications.findOne({_id:article.journalId}) || {};
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
        }

        article.authorNotes.forEach(function (address) {
            var authorName = _.find(article.authors, function (obj) {
                return obj.email == address.id;
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
                    "rootUrl": Config.rootUrl,
                    "phone":article.journal.phone,
                    "fax":article.journal.fax,
                    "email":article.journal.email,
                    "address":article.journal.address?article.journal.address.en:null
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
                "rootUrl": Config.rootUrl,
                "email":Config.contactInfo.email,
                "fax":Config.contactInfo.fax,
                "address":Config.contactInfo.address,
                "phone":Config.contactInfo.phone
            })

        });
        logger.silly("search frequency email sent");
        searchLogs.forEach(function (entry) {
            SearchLog.update({_id: entry._id}, {$set: {count: 0}});
        });
    }
};

Science.Email.tableOfContentEmail = function (date,email) {
    var emailConfig = EmailConfig.findOne({key: "watchJournal"});
    Issues.find({createDate: {$gt: date}}).forEach(function (oneIssue) {
        var userList;
        if(!email){
            userList = Users.find({'profile.journalsOfInterest': {$in: [oneIssue.journalId]}});
            if(!userList.count()) return;
            logger.info("found " + userList.count()+" users watched this journal which has the id: " + oneIssue.journalId);
        }

        var articleList = Articles.find({
            journalId: oneIssue.journalId,
            volume: oneIssue.volume,
            issue: oneIssue.issue,
            pubStatus: 'normal'
        }, {
            fields: {
                _id: 1,
                title: 1,
                doi:1,
                authors: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                engPage:1,
                journal: 1,
                pdfId: 1
            },sort:{
                padPage:1
            }

        }).fetch();
        if (!articleList || !articleList.length) return;

        logger.info("finded " + articleList.length+" articles in the newest issue which has the id: " + oneIssue._id);
        var journal = Publications.findOne({_id: oneIssue.journalId}, {
            fields: {
                title: 1,
                titleCn: 1,
                description: 1,
                banner: 1,
                submissionReview: 1,
                email:1,
                address:1,
                fax:1,
                phone:1
            }
        });
        if(!journal) return;

        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(oneIssue.journalId).substring(1));
        journal.pdfUrl = Meteor.absoluteUrl();
        journal.mostRead = Meteor.absoluteUrl("mostReadArticles/" + oneIssue.journalId);
        if (journal.banner) {
            var banner = Images.findOne({_id: journal.banner});
            if(banner){
                journal.banner=Meteor.absoluteUrl(banner.url({auth:false}).substring(1));
            }
        }
        generateArticleLinks(articleList, journal);

        oneIssue.url = Meteor.absoluteUrl(Science.URL.issueDetail(oneIssue._id).substring(1));
        oneIssue.month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+oneIssue.month];
        var journalNews = journalIdToNews(oneIssue.journalId);

        var content = JET.render('watchJournal', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "issue": oneIssue,
            "journal": journal,
            "articleList": articleList,
            "journalNews": journalNews,
            "email":journal.email,
            "address":journal.address?journal.address.en:null,
            "fax":journal.fax,
            "phone":journal.phone
        });
        if(email){
            Email.send({
                to: email,
                from: Config.mailServer.address,
                subject: emailConfig ? emailConfig.subject : journal.titleCn + " 更新第" + oneIssue.issue + "期",
                html: content
            });
        }else{
            userList.forEach(function (oneUser) {
                logger.info("sent watchJournal email to "+oneUser.emails[0].address);
                Email.send({
                    to: oneUser.emails[0].address,
                    from: Config.mailServer.address,
                    subject: emailConfig ? emailConfig.subject : journal.titleCn + " 更新第" + oneIssue.issue + "期",
                    html: content
                });
            });
        }
    });
};

Science.Email.availableOnline = function (date ,email) {
    var emailConfig = EmailConfig.findOne({key: "availableOnline"});
    Articles.aggregate([{
        $match: {
            $and: [
                {pubStatus: 'online_first'},
                {createdAt: {$gt: date}}
            ]
        }
    }, {
        $group: {
            _id: "$journalId",
            articleList: {$push:  {
                _id: "$_id",
                title: "$title",
                authors: "$authors",
                year: "$year",
                volume: "$volume",
                issue: "$issue",
                elocationId: "$elocationId",
                endPage:"$endPage",
                journalId: "$journalId",
                journal: "$journal",
                doi:"$doi",
                contentType:"$contentType",
                pdfId:"$pdfId",
            }}
        }
    }]).forEach(function (obj) {
        var userList;
        if(!email) {
            userList = Users.find({'profile.journalsOfInterest': {$in: [obj._id]}});
            if (!userList.count()) return;
        }

        if (!obj.articleList || !obj.articleList.length) return;
        var journal = Publications.findOne({_id: obj._id}, {
            fields: {
                title: 1,
                titleCn: 1,
                description: 1,
                banner: 1,
                picture:1,
                submissionReview: 1,
                email:1,
                address:1,
                fax:1,
                phone:1
            }
        });
        if(!journal) return;
        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(obj._id).substring(1));
        journal.pdfUrl = Meteor.absoluteUrl();
        journal.banner = Publications.findOne({_id: obj._id},{fields: {banner: 1}}).banner;
        journal.picture = Publications.findOne({_id: obj._id},{fields: {picture: 1}}).picture;
        if (journal.banner) {
            var banner = Images.findOne({_id: journal.banner});
            if(banner){
                journal.banner=Meteor.absoluteUrl(banner.url({auth:false}).substring(1));
            }
        }
        if (journal.picture) {
            var picture = Images.findOne({_id: journal.picture});
            if(picture){
                journal.picture=Meteor.absoluteUrl(picture.url({auth:false}).substring(1));
            }
        }
        generateArticleLinks(obj.articleList, journal);
        var journalNews = journalIdToNews(journal._id);
        var newDate = new Date();
        var lastDate = new Date(newDate-86400000*7);
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var onlineTitle = journal.title + " Advance Access for " + month[newDate.getMonth()+1] + " " + newDate.getDate() + " " + newDate.getFullYear();
        var nextWeek = newDate.getDate() + " " + month[newDate.getMonth()+1] + " " + newDate.getFullYear();
        var lastWeek = lastDate.getDate() + " " + month[lastDate.getMonth()+1] + " " + lastDate.getFullYear();
        var content = JET.render('availableOnline', {
            "onlineUrl": Config.rootUrl + "email/online.jpg",
            "onlineNowUrl": Config.rootUrl + "email/nowOnline.jpg",
            "rootUrl": Config.rootUrl,
            "journal": journal,
            "articleList": obj.articleList,
            "journalNews":journalNews,
            "email":journal.email,
            "address":journal.address?journal.address.en:null,
            "fax":journal.fax,
            "phone":journal.phone,
            "nextWeek":nextWeek,
            "lastWeek":lastWeek
        });
        if(email){
            Email.send({
                to: email,
                from: Config.mailServer.address,
                //subject: emailConfig ? emailConfig.subject : "Available Online Now",
                subject:onlineTitle,
                html: content
            });
        }else{
            userList.forEach(function (oneUser) {
                Email.send({
                    to: oneUser.emails[0].address,
                    from: Config.mailServer.address,
                    //subject: emailConfig ? emailConfig.subject : "Available Online Now",
                    subject:onlineTitle,
                    html: content
                });
            });
        }
    });
};

Science.Email.watchTopicEmail = function (date) {
    var emailConfig = EmailConfig.findOne({key: "watchTopic"});
    var homePageNews = homepageNews();
    Topics.find().forEach(function (oneTopic) {
        var userList = Users.find({'profile.topicsOfInterest': {$in: [oneTopic._id]}});
        if(!userList.count()) return;
        var articleList = Articles.find({
            $and: [
                {topic: {$in: [oneTopic._id]}},
                {createdAt: {$gt: date}},
                {pubStatus: 'normal'}
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
                journal: 1,
                pdfId: 1
            }
        }).fetch();
        if (!articleList || !articleList.length) return;
        generateArticleLinks(articleList);

        var content = JET.render('watchTopic', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "topic": oneTopic,
            "articleList": articleList,
            "homePageNews": homePageNews,
            "email":Config.contactInfo.email,
            "fax":Config.contactInfo.fax,
            "address":Config.contactInfo.address,
            "phone":Config.contactInfo.phone
        });
        userList.forEach(function (oneUser) {
            Email.send({
                to: oneUser.emails[0].address,
                from: Config.mailServer.address,
                subject: emailConfig ? emailConfig.subject : oneTopic.name + "下有文章更新",
                html: content
            });
        });
    });
};

Science.Email.watchArticleCitedAlertEmail = function (date) {
    var emailConfig = EmailConfig.findOne({key: "watchArticle"});
    Citations.aggregate([{
        $match: {createdAt: {$gt: date}}
    }, {
        $group: {
            _id: "$articleId",
            citations: {$push: "$citation"}
        }
    }]).forEach(function (articleCitations) {
        var userList = Users.find({'profile.articlesOfInterest': {$in: [articleCitations._id]}});
        if(!userList.count()) return;
        var article = Articles.findOne({_id: articleCitations._id}, {
            fields: {
                title: 1,
                authors: 1,
                authorNotes: 1,
                year: 1,
                volume: 1,
                issue: 1,
                elocationId: 1,
                journalId: 1,
                journal: 1
            }
        });
        if (!article) return;
        article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
        if (article.journalId) {
            article.journal = Publications.findOne({_id:article.journalId});
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journalId).substring(1));
            article.journal.banner = Publications.findOne({_id: article.journalId},{fields: {banner: 1}}).banner;
            if (article.journal.banner) article.journal.banner = Meteor.absoluteUrl(Images.findOne({_id: article.journal.banner}).url({auth:false}).substring(1));
        }
        var content = JET.render('citationAlertEmail', {
            "scpLogoUrl": Config.rootUrl + "email/logo.png",
            "rootUrl": Config.rootUrl,
            "article": article,
            "userName": "USERNAME",
            "citations": articleCitations.citations,
            "phone":article.journal.phone,
            "fax":article.journal.fax,
            "email":article.journal.email,
            "address":article.journal.address?article.journal.address.en:null
        });
        userList.forEach(function (oneUser) {
            Email.send({
                to: oneUser.emails[0].address,
                from: Config.mailServer.address,
                subject: emailConfig ? emailConfig.subject : 'Article cited alert',
                html: content.replace(/USERNAME/, oneUser.username)
            });
        });
    });
};



var generateArticleLinks = function (articles, journal) {
    articles.forEach(function (article) {
        if (article._id)
            article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
        article.journal= journal || article.journal || {};
        if (journal && journal.url)
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journal._id).substring(1));
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

var homepageNews = function () {
    var news = News.find({types: '1'}, {sort: {createDate: -1}}).fetch();
    var rootUrl = Config.rootUrl;
    news.forEach(function (item) {
        item.abstract.cn = cutString(Science.String.forceClear(item.abstract.cn), 415);
        if (!item.url) item.url = rootUrl + "news/" + item._id
    });
    return news;
};

var cutString = function(str,len,suffix){
    if(!str) return "";
    if(len<= 0) return "";
    if(!suffix) suffix = "...";
    var templen=0;
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>255){
            templen+=2;
        }else{
            templen++
        }
        if(templen == len){
            return str.substring(0,i+1)+suffix;
        }else if(templen >len){
            return str.substring(0,i)+suffix;
        }
    }
    return str;
};