Science.Reports = {};
Science.Reports.getKeywordReportFile = function (query, fileName) {
    console.dir(query);
    var data = Science.Reports.getKeywordReportData(query);
    console.dir(data);
    var fields = [
        {
            key: 'keywords',
            title: '高频词'
        },
        {
            key: 'total',
            title: '次数',
            type: 'number'
        }
    ];
    return Excel.export(fileName, fields, data);
}

Science.Reports.getJournalReportFile = function (query, fileName) {
    console.dir(query);
    var data = Science.Reports.getJournalReportDataNew(query);
    console.dir(data);
    var fields = Science.Reports.getJournalReportFields();
    return Excel.export(fileName, fields, data);
}

Science.Reports.getKeywordReportData = function (query) {
    var audit = PageViews.aggregate([
        {
            $match: {
                $and: [query]
            }
        },
        {
            $group: {_id: '$keywords', total: {$sum: 1}}
        },
        {
            $sort: {total: -1}
        }]);
    _.each(audit, function (x) {
        x.keywords = x._id;
        var months = PageViews.aggregate(
            [
                {
                    $match: {
                        $and: [query]
                    }
                },
                {$project: {month_viewed: {$month: "$when"}}},
                {$group: {_id: "$month_viewed", total: {$sum: 1}}},
                {$sort: {"_id.month_viewed": -1}}
            ]
        )
        x.months = months;
    })
    return audit;
}

Science.Reports.getJournalReportFields = function () {
    var fields = [
        {
            key: 'title',
            title: '出版物',
            width: 17
        },
        {
            key: 'publisher',
            title: '出版商',
            width: 15
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 8
        },
        {
            key: 'EISSN',
            title: 'EISSN',
            width: 8
        },
        {
            key: 'total',
            title: '首页点击次数',
            width: 10,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each
    _.each(['201509', '201510', '201511', '201512'], function (item) {
        fields.push({
            key: 'journalBrowse',
            title: item,
            width: 7,
            type: 'number',
            transform: function (val, doc) {
                if (val.months[item])
                    return val.months[item]
            }
        })
    })
    return fields;
}

Science.Reports.getJournalReportData = function (query) {
    //get each view by journal counting each reoccurence
    var audit = PageViews.aggregate([
        {
            $match: {
                $and: [query]
            }
        },
        {
            $group: {_id: '$journalId', total: {$sum: 1}}
        },
        {
            $sort: {total: -1}
        }]);
    //for each result get metadate then pull monthly data
    _.each(audit, function (x) {
        var journal = Publications.findOne({_id: x._id});
        x.publisher = Publishers.findOne({_id: journal.publisher}).name;
        x.title = journal.title;
        x.issn = journal.issn;
        x.EISSN = journal.EISSN;
        query.journalId = x._id;
        var months = PageViews.aggregate(
            [
                {
                    $match: {
                        $and: [query]
                    }
                },
                {$project: {month_viewed: {$month: "$when"}}},
                {$group: {_id: "$month_viewed", total: {$sum: 1}}},
                {$sort: {"_id.month_viewed": -1}}
            ]
        )
        x.months = months;
    })
    return audit;
}
Future = Npm.require('fibers/future');
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
                _.extend(item, x);
            })
            return myFuture.return(result);

        }
    );
    return myFuture.wait();
}