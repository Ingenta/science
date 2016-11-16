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
            pubStatus: 'normal',
            contentType:{$ne:"erratum"}
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
                endPage:1,
                journal: 1,
                pdfId: 1,
                contentType:1,
                sections:1,
                special:1,
                topic:1,
                language:1
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
                picture:1,
                submissionReview: 1,
                email:1,
                address:1,
                fax:1,
                phone:1,
                language:1
            }
        });
        if(!journal) return;
        journal.title = journal.language == "1"?journal.title:journal.titleCn;
        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(oneIssue.journalId).substring(1));
        journal.mostRead = Meteor.absoluteUrl("mostReadArticles/" + oneIssue.journalId);
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
        //期刊栏目
        if(journal.language == "1"){
            journal.manuscriptLabel = "Submission and Review";
            journal.authorCenterLabel = "Author Guidelines";
            journal.currentIssueLabel = "Current Issue";
            journal.mostReadLabel = "Most Read Articles";
            journal.newsCenter = "News Center";
            journal.pubTrends = "Publication Trends";
            journal.volumeLabel = "Volume " + oneIssue.volume;
            journal.issueLabel = "Issue " + oneIssue.issue;
        }else{
            journal.manuscriptLabel = "投审稿入口";
            journal.authorCenterLabel = "作者须知";
            journal.currentIssueLabel = "当期目录";
            journal.mostReadLabel = "热读文章";
            journal.newsCenter = "新闻中心";
            journal.pubTrends = "出版动态";
            journal.volumeLabel = "第" + oneIssue.volume + "卷";
            journal.issueLabel = "第" + oneIssue.issue + "期";
        }
        generateArticleLinks(articleList, journal);

        oneIssue.url = Meteor.absoluteUrl(Science.URL.issueDetail(oneIssue._id).substring(1));
        oneIssue.month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+oneIssue.month];
        var journalNews = journalIdToNews(oneIssue.journalId);
        var newDate = new Date();
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var subjectTitle = journal.title + " Table of Contents for " + month[newDate.getMonth()+1] + " " + newDate.getDate() + ", " + newDate.getFullYear()+"; "+"Vol. "+oneIssue.volume+", Issue "+oneIssue.issue;
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
                //subject: emailConfig ? emailConfig.subject : journal.titleCn + " 更新第" + oneIssue.issue + "期",
                subject:subjectTitle,
                html: content
            });
        }else{
            userList.forEach(function (oneUser) {
                logger.info("sent watchJournal email to "+oneUser.emails[0].address);
                Email.send({
                    to: oneUser.emails[0].address,
                    from: Config.mailServer.address,
                    //subject: emailConfig ? emailConfig.subject : journal.titleCn + " 更新第" + oneIssue.issue + "期",
                    subject:subjectTitle,
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
                {createdAt: {$gt: date}},
                {contentType:{$ne:"erratum"}}
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
                sections:"$sections",
                special:"$special",
                topic:"$topic",
                language:"$language"
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
                phone:1,
                language:1
            }
        });
        if(!journal) return;
        journal.title = journal.language == "1"?journal.title:journal.titleCn;
        journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(obj._id).substring(1));
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
        //期刊栏目
        if(journal.language == "1"){
            journal.newsCenter = "News Center";
            journal.pubTrends = "Publication Trends";
        }else{
            journal.newsCenter = "新闻中心";
            journal.pubTrends = "出版动态";
        }
        generateArticleLinks(obj.articleList, journal);
        var journalNews = journalIdToNews(journal._id);
        var newDate = new Date();
        var lastDate = new Date(newDate-86400000*7);
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var onlineTitle = journal.title + " Advance Access for " + month[newDate.getMonth()+1] + " " + newDate.getDate() + ", " + newDate.getFullYear();
        var nextWeek = newDate.getDate()-1 + " " + month[newDate.getMonth()+1] + " " + newDate.getFullYear();
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
                {pubStatus: 'normal'},
                {contentType:{$ne:"erratum"}}
            ]
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
                endPage:1,
                journalId: 1,
                journal: 1,
                pdfId: 1,
                contentType:1,
                sections:1,
                special:1,
                topic:1,
                language:1
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
        //文章链接和hostname
        if (article._id){
            article.url = Meteor.absoluteUrl(Science.URL.articleDetail(article._id).substring(1));
            article.pdfUrl = Config.rootUrl;
            //文章标题
            article.title = article.language == "1"?article.title.en:article.title.cn;
            //期刊名称
            article.journal.title = article.language == "1"?article.journal.title:article.journal.titleCn;
        }
        //期刊链接
        article.journal= journal || article.journal || {};
        if (journal && journal.url)
            article.journal.url = Meteor.absoluteUrl(Science.URL.journalDetail(article.journal._id).substring(1));
        //提取作者
        if(article.authors){
            var author = [];
            article.authors.forEach(function (item) {
                if(item.fullname)
                    if(article.language == "1"){
                        author.push(item.fullname.en);
                    }else{
                        author.push(item.fullname.cn);
                    }
            });
            article.authorFullName = author.join(", ");
        }
        //提取文章栏目类型
        if(article.contentType){
            var articleType = ContentType.findOne({subject:article.contentType});
            article.contentType = articleType && article.language == "1"?articleType.name.en:articleType.name.cn;
        }
        //提取主题学科
        if(article.topic){
            var topicId;
            if(_.isArray(article.topic) && !_.isEmpty(article.topic)){
                topicId = article.topic[0];
            } else if(_.isString(article.topic)){
                topicId = article.topic;
            }
            var topic = Topics.findOne({_id:topicId});
            article.topic = topic && article.language == "1"?topic.englishName:topic.name;
        }
        //邮件内容标签字段
        if(article.language == "1"){
            article.abstractLabel = "[Abstract]";
            article.fulltextLabel = "[Full Text]";
        }else{
            article.abstractLabel = "[摘要]";
            article.fulltextLabel = "[全文]";
        }
    });
};

var journalIdToNews = function (journalId) {
    var news = {};
    var journal = Publications.findOne({_id: journalId}, {fields: {shortTitle: 1, publisher: 1,language:1}});
    if(journal)var publisher = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
    news.newsCenter = News.find({publications: journalId, about: 'a1'}, {sort: {releaseTime: -1}, limit: 3, fields: {title: 1,abstract:1,url:1}}).fetch();
    news.publishingDynamic = News.find({publications: journalId, about: 'b1'}, {sort: {releaseTime: -1}, limit: 3, fields: {title: 1,abstract:1,url:1}}).fetch();
    //news.meetingInfo = Meeting.find({publications: journalId, about: 'c1'}, {sort: {startDate: -1}, limit: 3}).fetch();
    var rootUrl = Config.rootUrl;
    news.newsCenter.forEach(function (item) {
        if(item.title)item.title = item.title && journal.language == "1"?item.title.en:item.title.cn;
        if(item.abstract){
            if(journal.language == "1"){
                item.abstract = item.abstract.en && item.abstract.en.length < 120?item.abstract.en:item.abstract.en.substring(0,120)+"...";
            }else{
                item.abstract = item.abstract.cn && item.abstract.cn.length < 47?item.abstract.cn:item.abstract.cn.substring(0,47)+"...";
            }
        }
        if (!item.url) item.url = rootUrl + "publisher/" + publisher.shortname + "/journal/" + journal.shortTitle + "/news/journalNews/" + item._id
    });
    news.publishingDynamic.forEach(function (item) {
        if(item.title)item.title = item.title && journal.language == "1"?item.title.en:item.title.cn;
        if(item.abstract){
            if(journal.language == "1"){
                item.abstract = item.abstract.en && item.abstract.en.length < 120?item.abstract.en:item.abstract.en.substring(0,120)+"...";
            }else{
                item.abstract = item.abstract.cn && item.abstract.cn.length < 47?item.abstract.cn:item.abstract.cn.substring(0,47)+"...";
            }
        }
        if (!item.url) item.url = rootUrl + "publisher/" + publisher.shortname + "/journal/" + journal.shortTitle + "/news/journalNews/" + item._id
    });
    //news.meetingInfo.forEach(function (item) {
    //    item.startDate = moment(item.startDate).format("MMM Do YYYY");
    //});
    return news;
};

var homepageNews = function () {
    var news = News.find({types: '1'}, {sort: {releaseTime: -1}, fields: {title: 1,abstract:1,url:1}}).fetch();
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