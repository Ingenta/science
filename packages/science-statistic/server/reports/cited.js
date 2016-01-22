//CitedJournal
Science.Reports.getCitedJournalReportFile = function (query, fileName) {
    delete query.when;
    delete query.institutionId;
    delete query.action;
    query.citations = {$exists: true};
    var data = Science.Reports.getJournalCitedReportData(query);
    var fields = Science.Reports.getCitedJournalReportFields(data.range);
    return Excel.export(fileName, fields, data);
};
//CitedArticle
Science.Reports.getCitedArticleReportFile = function (query, fileName) {
    delete query.when;
    delete query.institutionId;
    delete query.action;
    query.citations = {$exists: true};
    console.dir(query);
    var data = Articles.find(query,{sort: {'citationCount': -1}, limit: 100, fields: {title:1,doi:1,issue:1,volume:1,journal:1,publisher:1,citationCount:1}}).fetch();
    var fields = Science.Reports.getCitedArticleReportFields();
    console.dir(data);
    return Excel.export(fileName, fields, data);
};

Science.Reports.getCitedJournalReportFields = function (range) {
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
            title: '被引用次数',
            width: 15,
            type: 'number'
        }
    ];
    var yearArr=[];
    for(var i=range.max;i>=range.min;i--) {
        yearArr.push(String(i));
    }
    _.each(yearArr,function(year){
        fields.push({
            key: 'years',
            title: year,
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(!val)return 0;
                if(!val["year"+year])return 0;
                return val["year"+year];
            }
        })
    })
    return fields;
};

Science.Reports.getCitedArticleReportFields = function () {
    var fields = [
        {
            key: 'title.cn',
            title: '文章标题'
        },
        {
            key: 'doi',
            title: 'DOI',
            width: 25
        },
        {
            key: 'journal.titleCn',
            title: '期刊名称'
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 25,
            transform: function(val, doc) {
                var publisher = Publishers.findOne({_id: val});
                if(publisher)return publisher.chinesename;
                return;
            }
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
            key: 'citationCount',
            title: '被引用次数',
            width: 15,
            type: 'number'
        }
    ];
    return fields;
};