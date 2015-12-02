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
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var fields = [
        {
            key: 'title',
            title: '出版物'
        },
        {
            key: 'publisher',
            title: '出版商'
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
            type: 'number'
        }
    ];
    //console.dir(data);
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