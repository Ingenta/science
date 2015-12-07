//fulltext
Science.Reports.getArticleFulltextReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleFulltextReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//abstract
Science.Reports.getArticleAbstractReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleAbstractReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//pdfDownload
Science.Reports.getPDFDownloadReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getPDFDownloadReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//favourite
Science.Reports.getArticleFavouriteReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleFavouriteReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//watchArticle
Science.Reports.getArticleWatchReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleWatchReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
//emailThis
Science.Reports.getArticleRecommendReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getArticleReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getArticleRecommendReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};

//ArticleBrowseDownload
Science.Reports.getArticleBrowseReportFile = function (query, fileName) {
    var type =['fulltext','abstract','pdfDownload'];
    query.action = {$in:type};
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    var fields = Science.Reports.getArticleBrowseReportFields();
    console.dir(data);
    return Excel.export(fileName, fields, data);
};
//ArticleFavouriteWatch
Science.Reports.getArticleFavouriteWatchReportFile = function (query, fileName) {
    var type =['favourite','watchArticle','emailThis'];
    query.action = {$in:type};
    console.dir(query);
    var data = Science.Reports.getArticleReportDataNew(query);
    var fields = Science.Reports.getArticleFavouriteWatchReportFields();
    console.dir(data);
    return Excel.export(fileName, fields, data);
};
Science.Reports.getArticleBrowseReportFields = function () {
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

Science.Reports.getArticleFavouriteWatchReportFields = function () {
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
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
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};