//RegionalJournal
Science.Reports.getRegionalJournalReportFile = function (query, fileName) {
    var type =['journalOverview','journalBrowse','watchJournal'];
    query.action = {$in:type};
    var data = Science.Reports.getRegionalData(query);
    var fields = Science.Reports.getRegionalJournalReportFields();
    return Excel.export(fileName, fields, data);
};
//RegionalArticle
Science.Reports.getRegionalArticleReportFile = function (query, fileName) {
    var type =['fulltext','abstract','pdfDownload','favourite','watchArticle','emailThis'];
    query.action = {$in:type};
    var data = Science.Reports.getRegionalData(query);
    var fields = Science.Reports.getRegionalArticleReportFields();
    return Excel.export(fileName, fields, data);
};
Science.Reports.getRegionalJournalReportFields = function () {
    var fields = [
        {
            key: 'country',
            title: '国别'
        },
        {
            key: 'region',
            title: '省区'
        },
        {
            key: 'journalOverview',
            title: '期刊首页浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'journalBrowse',
            title: '期刊目录浏览',
            width: 20,
            type: 'number'
        },
        {
            key: 'watchJournal',
            title: '期刊关注',
            width: 20,
            type: 'number'
        }
    ];
    return fields;
};

Science.Reports.getRegionalArticleReportFields = function () {
    var fields = [
        {
            key: 'country',
            title: '国别'
        },
        {
            key: 'region',
            title: '省区'
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