Science.Reports = {};
//-------------------------日期循环----------------------------------
Science.Reports.getLastTwelveMonths = function (start, end) {
    var result = [];
    if (!end)end = new Date();
    if (!start)start = new Date(end).addMonths(-11);
    var startYear = start.getFullYear();
    var endYear = end.getFullYear();
    for (var year = startYear; year <= endYear; year++) {
        var currStartMonth = startYear == year ? start.getMonth() + 1 : 1;
        var currEndMonth = year == endYear ? end.getMonth() + 1 : 12;
        for (var month = currStartMonth; month <= currEndMonth; month++) {
            var monthstr=month<10?"0"+month.toString():month.toString();
            result.push(year.toString() + monthstr)
        }
    }
    return result;
};

//----------------------------数据方法-------------------------------------

Future = Npm.require('fibers/future');

Science.Reports.getKeywordReportData = function (query) {
    var myFuture = new Future();
    PageViews.rawCollection().group(
        {keywords: true},
        query,
        {total: 0},
        function (doc, result) {
            result.total++;
            if (!result[doc.action])
                result[doc.action] = {months: {}};
            if (!result[doc.action].months[doc.dateCode])
                result[doc.action].months[doc.dateCode] = 0;
            result[doc.action].months[doc.dateCode] = result[doc.action].months[doc.dateCode] + 1
        },
        function (err, result) {
            return myFuture.return(result);
        }
    );
    return myFuture.wait();
};

Science.Reports.getJournalReportData = function (query) {
    var myFuture = new Future();
    var allJournals = Publications.find().fetch();
    var allPublisher = Publishers.find().fetch();
    PageViews.rawCollection().group(
        {journalId: true},
        query,
        {total: 0},
        function (doc, result) {
            result.total++;
            if (!result[doc.action])
                result[doc.action] = {months: {}};
            if (!result[doc.action].months[doc.dateCode])
                result[doc.action].months[doc.dateCode] = 0;
            result[doc.action].months[doc.dateCode] = result[doc.action].months[doc.dateCode] + 1
        },
        function (err, result) {
            _.each(result, function (item) {
                var journal = _.findWhere(allJournals, {_id: item.journalId})
                if(journal){
                    var x = {};
                    x.publisher = _.findWhere(allPublisher, {_id: journal.publisher}).chinesename;
                    x.title = journal.titleCn;
                    x.issn = journal.issn;
                    x.EISSN = journal.EISSN;
                    _.extend(item, x);
                }
            })
            return myFuture.return(result);
        }
    );
    return myFuture.wait();
};

Science.Reports.getArticleReportData = function (query) {
    var myFuture = new Future();
    var allPublisher = Publishers.find().fetch();
    PageViews.rawCollection().group(
        {articleId: true},
        query,
        {total: 0},
        function (doc, result) {
            result.total++;
            if (!result[doc.action])
                result[doc.action] = {months: {}};
            if (!result[doc.action].months[doc.dateCode])
                result[doc.action].months[doc.dateCode] = 0;
            result[doc.action].months[doc.dateCode] = result[doc.action].months[doc.dateCode] + 1
        },
        Meteor.bindEnvironment( function (err, result) {
            var deletedArticles =[];
            _.each(result, function (item) {
                var article = Articles.findOne({_id: item.articleId},{fields:{title:1,doi:1,issue:1,volume:1,journal:1,publisher:1}});
                if(article){
                    var x = {};
                    x.journal = article.journal.titleCn;
                    x.publisher = _.findWhere(allPublisher, {_id: article.publisher}).chinesename;
                    x.title = article.title.cn;
                    x.doi = article.doi;
                    x.issue = article.issue;
                    x.volume = article.volume;
                    _.extend(item, x);
                }else{
                    deletedArticles.push(item);
                }
            })
            result = _.difference(result,deletedArticles);
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
};

Science.Reports.getUserActionData = function(query){
    var myFuture = new Future();
    PageViews.rawCollection().group(
        {userId: true},
        query,
        {},
        function (doc, result) {
            if (!result[doc.action])
                result[doc.action] = 0;
            result[doc.action]++;
        },
        Meteor.bindEnvironment( function (err, result) {
            _.each(result, function (item) {
                var users = Users.findOne({_id: item.userId},{fields:{username:1,emails:1,profile:1,level:1}});
                var x = {};
                if(users){
                    x.name = users.username;
                    if(users.emails){
                        if(users.emails[0].address){
                            x.emails = users.emails[0].address;
                        }
                    }
                    if(users.profile){
                        if(users.profile.institution){
                            x.institutionName = users.profile.institution;
                        }
                        if(users.profile.fieldOfResearch){
                            x.fieldOfResearch = users.profile.fieldOfResearch;
                        }
                        if(users.profile.journalsOfInterest){
                            var journals = [];
                            users.profile.journalsOfInterest.forEach(function (journalId) {
                                var journal = Publications.findOne({_id:journalId},{fields:{titleCn:1}});
                                if(journal){
                                    journals.push(journal.titleCn);
                                }
                            });
                            x.journalsOfInterest = journals.join(", ");
                        }
                        if(users.profile.topicsOfInterest){
                            var topics = [];
                            users.profile.topicsOfInterest.forEach(function (topicId) {
                                var topic = Topics.findOne({_id:topicId},{fields:{name:1}});
                                if(topic){
                                    topics.push(topic.name);
                                }
                            });
                            x.topicsOfInterest = topics.join(", ");
                        }
                        if(users.profile.phone){
                            x.phone = users.profile.phone;
                        }
                        if(users.profile.address){
                            x.address = users.profile.address;
                        }
                        if(users.profile.weChat){
                            x.weChat = users.profile.weChat;
                        }
                    }
                    if(users.level=="admin"){
                        x.userType = "超级管理员";
                    }else if(users.level=="publisher") {
                        x.userType = "出版商管理员";
                    }else if(users.level=="journal"){
                        x.userType = "期刊管理员";
                    }else if(users.level=="institution"){
                        x.userType = "机构用户";
                    }else{
                        x.userType = "普通用户";
                    }

                }else{
                    x.userType = "游客";
                }
                _.extend(item, x);
            })
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
}

Science.Reports.getInstitutionActionData = function(query){
    var myFuture = new Future();
    PageViews.rawCollection().group(
        {institutionId:true},
        query,
        {},
        function (doc, result) {
            if (!result[doc.action])
                result[doc.action] = 0;
            result[doc.action]++;
        },
        Meteor.bindEnvironment( function (err, result) {
            var deletedInstitution = []
            _.each(result, function (item) {
                var institution = Institutions.findOne({_id: item.institutionId},{fields:{name:1,number:1,type:1}});
                var x = {};
                if(institution){
                    x.name = institution.name.cn;
                    x.number = institution.number;
                    if(institution.type=="1"){
                        x.type = "图书馆";
                    }else if(institution.type=="2"){
                        x.type = "出版商";
                    }else if(institution.type=="3"){
                        x.type = "编辑部";
                    }else if(institution.type=="4"){
                        x.type = "大学";
                    }else if(institution.type=="5"){
                        x.type = "研究机构";
                    }else if(institution.type=="6"){
                        x.type = "其他";
                    }else{
                        x.type = "";
                    }
                }else{
                    x.name = "无";
                    x.number = "无";
                    x.type = "无";
                    deletedInstitution.push(item);
                }
                _.extend(item, x);
            })
            result = _.difference(result,deletedInstitution);
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
}

Science.Reports.getRegionalData = function(query){
    var myFuture = new Future();
    PageViews.rawCollection().group(
        {ip: true},
        query,
        {},
        function (doc, result) {
            if (!result[doc.action])
                result[doc.action] = 0;
            result[doc.action]++;
        },
        Meteor.bindEnvironment( function (err, result) {
            _.each(result, function (item) {
                var regional = getLocationFromLocalDatabase(item.ip);
                var x = {};
                if(regional){

                    x.country = regional.country_chinese_name;
                    x.region = regional.region_chinese_name;
                }else{
                    x.country = "未知";
                    x.region = "未知";
                }
                _.extend(item, x);
            })
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
}

Science.Reports.getJournalArticleReportDataNew = function(query){
    var myFuture = new Future();
    var allJournals = Publications.find().fetch();
    var allPublisher = Publishers.find().fetch();
    PageViews.rawCollection().group(
        {journalId: true},
        query,
        {},
        function (doc, result) {
            if (!result[doc.action])
                result[doc.action] = 0;
            result[doc.action]++;
        },
        function (err, result) {
            _.each(result, function (item) {
                var journal = _.findWhere(allJournals, {_id: item.journalId});
                if(journal){
                    var x = {};
                    x.publisher = _.findWhere(allPublisher, {_id: journal.publisher}).chinesename;
                    x.title = journal.titleCn;
                    x.issn = journal.issn;
                    x.EISSN = journal.EISSN;
                    _.extend(item, x);
                }
            })
            return myFuture.return(result);
        }
    );
    return myFuture.wait();
}

Science.Reports.getArticleReportDataNew = function (query) {
    var myFuture = new Future();
    var allPublisher = Publishers.find().fetch();
    PageViews.rawCollection().group(
        {articleId: true},
        query,
        {},
        function (doc, result) {
            if (!result[doc.action])
                result[doc.action] = 0;
            result[doc.action]++;
        },
        Meteor.bindEnvironment( function (err, result) {
            var deletedArticles =[];
            _.each(result, function (item) {
                var article = Articles.findOne({_id: item.articleId},{fields:{title:1,doi:1,issue:1,volume:1,journal:1,publisher:1}});
                if(article){
                    var x = {};
                    x.journal = article.journal.titleCn;
                    x.publisher = _.findWhere(allPublisher, {_id: article.publisher}).chinesename;
                    x.title = article.title.cn;
                    x.doi = article.doi;
                    x.issue = article.issue;
                    x.volume = article.volume;
                    _.extend(item, x);
                }else{
                    deletedArticles.push(item);
                }
            })
            result = _.difference(result,deletedArticles);
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
};

Science.Reports.getJournalCitedReportData = function (query) {
    var myFuture = new Future();
    var allJournals = Publications.find().fetch();
    var allPublisher = Publishers.find().fetch();
    Articles.rawCollection().group(
        {journalId: true},
        query,
        {total:0,years:{},min:new Date().getFullYear()},
        function (doc, result) {
            result.total+=doc.citations.length;
            doc.citations.forEach(function(d){
                if (d.year){
                    if(d.year<result.min)
                        result.min= d.year;
                    var k="year"+ d.year;
                    if(!result.years[k])
                        result.years[k] = 0;
                    result.years[k]++;
                }
            })
        },
        function (err, result) {
            var currYear=new Date().getFullYear();
            var yearRange={max:currYear,min:currYear-10};
            var min = parseInt(_.min(_.pluck(result,"min")));
            if(min<yearRange.min)
                yearRange.min=min;
            result.range=yearRange;
            result.forEach(function (item) {
                var journal = _.findWhere(allJournals, {_id: item.journalId});
                if(journal){
                    var x = {};
                    x.publisher = _.findWhere(allPublisher, {_id: journal.publisher}).chinesename;
                    x.title = journal.titleCn;
                    x.issn = journal.issn;
                    x.EISSN = journal.EISSN;
                    _.extend(item, x);
                }
            })
            return myFuture.return(result);
        }
    );
    return myFuture.wait();
};

Science.Reports.getArticleCitedReportData = function (query) {
    var articles = Articles.find(query,{fields: {title:1,doi:1,issue:1,volume:1,journal:1,publisher:1,citations:1,year:1,elocationId:1,endPage:1}, sort: {year: 1}}).fetch();
    var currYear=new Date().getFullYear();
    var yearRange={max:currYear,min:currYear-10};
    articles.forEach(function (article) {
        if(article.citations){
            article.years = {};
            article.min = new Date().getFullYear();
            article.total = article.citations.length;
            article.citations.forEach(function (item) {
                if (item.year) {
                    if(item.year<article.min)
                        article.min= item.year;
                    var k="year"+ item.year;
                    if(!article.years[k])
                        article.years[k] = 0;
                    article.years[k]++;
                }
            });
            var min = parseInt(article.min);
            if(min<yearRange.min)
                yearRange.min=min;
        }
    });
    articles.range=yearRange;
    return articles;
};
//-----------------------------数据范围------------------------------
