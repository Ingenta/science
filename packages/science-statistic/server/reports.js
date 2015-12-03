Science.Reports = {};

//-------------------------日期循环----------------------------------
Science.Reports.getLastTwelveMonths = function (start, end) {
    var result = [];
    if (!end)end = new Date();
    if (!start)start = new Date(end).addMonths(-11);
    var startYear = start.getYear() + 1900;
    var endYear = end.getYear() + 1900;
    for (var year = startYear; year <= endYear; year++) {
        var currStartMonth = startYear == year ? start.getMonth() + 1 : 1;
        var currEndMonth = year == endYear ? end.getMonth() + 1 : 12;
        for (var month = currStartMonth; month <= currEndMonth; month++) {
            result.push(year.toString() + month.toString())
        }
    }
    return result;
};

//------------------------------模版生成------------------------------
//keyword
Science.Reports.getKeywordReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getKeywordReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getKeywordReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//overview
Science.Reports.getJournalOverviewReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalOverviewReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//browse
Science.Reports.getJournalBrowseReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalBrowseReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//watchJournal
Science.Reports.getJournalWatchReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//fulltext
Science.Reports.getArticleFulltextReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleFulltextReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//abstract
Science.Reports.getArticleAbstractReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleAbstractReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//pdfDownload
Science.Reports.getPDFDownloadReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getPDFDownloadReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};

//favourite
Science.Reports.getArticleFavouriteReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleFavouriteReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};

//watchArticle
Science.Reports.getArticleWatchReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};

//emailThis
Science.Reports.getArticleRecommendReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleRecommendReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleAbstract
Science.Reports.getJournalAbstractReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalAbstractReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleFulltext
Science.Reports.getJournalFulltextReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalFulltextReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticlePDFDownload
Science.Reports.getJournalDownloadReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalDownloadReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleFavourite
Science.Reports.getJournalArticleFavouriteReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleFavouriteReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleWatch
Science.Reports.getJournalArticleWatchReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleEmailThis
Science.Reports.getJournalArticleRecommendReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleRecommendReportFields(monthRange);
    return Excel.export(fileName, fields, data);
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
                var x = {};
                x.publisher = _.findWhere(allPublisher, {_id: journal.publisher}).name;
                x.title = journal.title;
                x.issn = journal.issn;
                x.EISSN = journal.EISSN;
                _.extend(item, x);
            })
            return myFuture.return(result);
        }
    );
    return myFuture.wait();
};

Science.Reports.getArticleReportDataNew = function (query) {
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
            _.each(result, function (item) {
                var article = Articles.findOne({_id: item.articleId},{fields:{title:1,doi:1,issue:1,volume:1,journal:1,publisher:1}});
                var x = {};
                x.journal = article.journal.title;
                x.publisher = _.findWhere(allPublisher, {_id: article.publisher}).name;
                x.title = article.title.en;
                x.doi = article.doi;
                x.issue = article.issue;
                x.volume = article.volume;
                _.extend(item, x);
            })
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
};

Science.Reports.getUsersJournalHomePageReportData = function (query) {
    var myFuture = new Future();
    var allJournals = Publications.find().fetch();
    var allPublisher = Publishers.find().fetch();
    PageViews.rawCollection().group(
        {userId: true},
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
        Meteor.bindEnvironment(function (err, result) {
            _.each(result, function (item) {
                var users = Users.find({_id: item.userId},{fields:{username:1,emails:1,issue:1}});
                var journal = _.findWhere(allJournals, {_id: item.journalId})
                var x = {};
                x.publisher = _.findWhere(allPublisher, {_id: journal.publisher}).name;
                x.title = journal.title;
                _.extend(item, x);
            })
            return myFuture.return(result);
        })
    );
    return myFuture.wait();
};
//-----------------------------数据范围------------------------------
Science.Reports.getKeywordReportFields = function (monthRange) {
    var fields = [
        {
            key: 'keywords',
            title: '高频词',
            width: 25
        },
        {
            key: 'total',
            title: '次数',
            width: 8,
            type: 'number'
        }
    ];
    _.each(monthRange, function (item) {
        fields.push({
            key: 'keyword',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                console.dir(doc);
                console.dir(val);
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalOverviewReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '首页点击次数',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'journalOverview',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalBrowseReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '目录浏览',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'journalBrowse',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalWatchReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '关注',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'watchJournal',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getArticleFulltextReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '全文浏览',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'fulltext',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getArticleAbstractReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '摘要浏览',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'abstract',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getPDFDownloadReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '全文下载',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'pdfDownload',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getArticleFavouriteReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '收藏',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'favourite',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getArticleWatchReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '关注',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'watchArticle',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getArticleRecommendReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issue',
            title: '期号',
            width: 8
        },
        {
            key: 'volume',
            title: '卷号',
            width: 8
        },
        {
            key: 'total',
            title: '推荐',
            width: 15,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'emailThis',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalAbstractReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '当前期刊下所有文章摘要浏览',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'abstract',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalFulltextReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '当前期刊下所有文章全文浏览',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'fulltext',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalDownloadReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '当前期刊下所有文章全文下载',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'pdfDownload',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalArticleFavouriteReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '收藏',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'favourite',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalArticleWatchReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '关注',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'watchArticle',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalArticleRecommendReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 12
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 12
        },
        {
            key: 'total',
            title: '推荐',
            width: 30,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(monthRange, function (item) {
        fields.push({
            key: 'emailThis',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};