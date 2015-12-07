//UsersJournal
Science.Reports.getUsersJournalReportFile = function (query, fileName) {
    var type =['journalOverview','journalBrowse','watchJournal'];
    query.action = {$in:type};
    console.dir(query);
    var data = Science.Reports.getUserActionData(query);
    var fields = Science.Reports.getUsersJournalReportFields();
    console.dir(data);
    return Excel.export(fileName, fields, data);
};
//UsersArticle
Science.Reports.getUsersArticleReportFile = function (query, fileName) {
    var type =['fulltext','abstract','pdfDownload','favourite','watchArticle','emailThis'];
    query.action = {$in:type};
    console.dir(query);
    var data = Science.Reports.getUserActionData(query);
    var fields = Science.Reports.getUsersArticleReportFields();
    console.dir(data);
    return Excel.export(fileName, fields, data);
};
Science.Reports.getUsersJournalReportFields = function () {
    var fields = [
        {
            key: 'userType',
            title: '用户类型'
        },
        {
            key: 'name',
            title: '用户名',
            width: 20
        },
        {
            key: 'emails',
            title: '用户邮箱'
        },
        {
            key: 'institutionName',
            title: '所属机构',
            width: 25
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

Science.Reports.getUsersArticleReportFields = function () {
    var fields = [
        {
            key: 'userType',
            title: '用户类型'
        },
        {
            key: 'name',
            title: '用户名',
            width: 20
        },
        {
            key: 'emails',
            title: '用户邮箱'
        },
        {
            key: 'institutionName',
            title: '所属机构',
            width: 25
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