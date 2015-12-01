Science.Reports = {};
Science.Reports.getKeywordReportFile = function (query, fileName) {
    console.dir(query);
    var data = PageViews.find(query).fetch();
    var fields = [
        {
            key: 'keywords',
            title: 'keyword'
        },
        {
            key: 'dateCode',
            title: 'Date'
        }
    ];
    console.dir(data);
    return Excel.export(fileName, fields, data);
}

Science.Reports.getJournalReportFile = function (query, fileName) {
    console.dir(query);
    var data = Science.Reports.getJournalReportData(query);
    console.dir(data);
    var fields = [
        {
            key: 'title',
            title: 'TIELE'
        },
        {
            key: 'issn',
            title: 'ISSN'
        },
        {
            key: 'issn',
            title: 'EISSN'
        },
        {
            key: 'publisher',
            title: 'PUBLISHER'
        },
        {
            key: 'total',
            title: 'CLICK TIMES TOTAL'
        },
        {
            key: 'months',
            title: 'DATE',
            transform: function(val, doc) {
            return val[0].total;
        }
        }
    ];
    //console.dir(data);
    return Excel.export(fileName, fields, data);
}

Science.Reports.getJournalReportData = function (query) {
    //get each view by journal counting each reoccurence
    if (!query.startDate)query.startDate = new Date('2010-01');
    if (!query.endDate)query.endDate = new Date();
    var audit = PageViews.aggregate([
        {
            $match: {
                $and: [
                    {action: "journalBrowse"},{when:{$gte:query.startDate, $lte:query.endDate}}
                ]
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
        var months = PageViews.aggregate(
            [
                {$match: {
                    $and: [
                        {action: "journalBrowse"},
                        {journalId: x._id},
                        {when:{$gte:query.startDate, $lte:query.endDate}}
                    ]
                }},
                { $project : { month_viewed : { $month : "$when" } } } ,
                { $group : { _id : "$month_viewed" , total : { $sum : 1 } } },
                { $sort : { "_id.month_viewed" : -1 } }
            ]
        )

        x.months = months;
    })
    return audit;
}