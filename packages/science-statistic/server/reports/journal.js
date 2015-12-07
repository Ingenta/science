//overview
Science.Reports.getJournalOverviewReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalOverviewReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//browse
Science.Reports.getJournalBrowseReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalBrowseReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//watchJournal
Science.Reports.getJournalWatchReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};

//journalArticleAbstract
Science.Reports.getJournalAbstractReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalAbstractReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleFulltext
Science.Reports.getJournalFulltextReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalFulltextReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticlePDFDownload
Science.Reports.getJournalDownloadReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalDownloadReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleFavourite
Science.Reports.getJournalArticleFavouriteReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleFavouriteReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleWatch
Science.Reports.getJournalArticleWatchReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalArticleEmailThis
Science.Reports.getJournalArticleRecommendReportFile = function (query, fileName, start, end) {
    var data = Science.Reports.getJournalReportData(query);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalArticleRecommendReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//journalSumArticleBrowse
Science.Reports.getJournalArticleBrowseReportFile = function (query, fileName) {
    var type =['fulltext','abstract','pdfDownload'];
    query.action = {$in:type};
    var data = Science.Reports.getJournalArticleReportDataNew(query);
    var fields = Science.Reports.getJournalArticleBrowseReportFields();
    return Excel.export(fileName, fields, data);
};
//journalSumArticleFavouriteWatch
Science.Reports.getJournalArticleFavouriteWatchReportFile = function (query, fileName) {
    var type =['favourite','watchArticle','emailThis'];
    query.action = {$in:type};
    var data = Science.Reports.getJournalArticleReportDataNew(query);
    var fields = Science.Reports.getJournalArticleFavouriteWatchReportFields();
    return Excel.export(fileName, fields, data);
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};

Science.Reports.getJournalArticleBrowseReportFields = function () {
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
            key: 'fulltext',
            title: '全文浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'abstract',
            title: '摘要浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'pdfDownload',
            title: '全文下载',
            width: 20,
            type: 'number'
        }
    ];
    return fields;
};

Science.Reports.getJournalArticleFavouriteWatchReportFields = function () {
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
            key: 'favourite',
            title: '收藏',
            width: 20,
            type: 'number'
        },
        {
            key: 'watchArticle',
            title: '关注',
            width: 20,
            type: 'number'
        },
        {
            key: 'emailThis',
            title: '个人推荐',
            width: 20,
            type: 'number'
        }
    ];
    return fields;
};
