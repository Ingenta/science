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
}

//------------------------------模版生成------------------------------
Science.Reports.getKeywordReportFile = function (query, fileName) {
    console.dir(query);
    var data = Science.Reports.getKeywordReportData(query);
    console.dir(data);
    var fields = Science.Reports.getKeywordReportFields();
    return Excel.export(fileName, fields, data);
}

Science.Reports.getJournalReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getJournalReportDataNew(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getJournalReportFields(monthRange);
    return Excel.export(fileName, fields, data);
}

//-----------------------------数据范围------------------------------
Science.Reports.getKeywordReportFields = function () {
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
    return fields;
}

Science.Reports.getJournalReportFields = function (monthRange) {
    var fields = [
        {
            key: 'title',
            title: '出版物'
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
            key: 'journalBrowse',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 7,
            type: 'number',
            transform: function (val, doc) {
                if(val.months[item]===undefined)return 0;
                return val.months[item];
            }
        })
    })
    return fields;
}

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
}

Science.Reports.getJournalReportDataNew = function (query) {
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
}