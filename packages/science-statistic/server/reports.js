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
            key: '_id',
            title: 'TIELE',
            transform: function(val, doc) {
                var publications = Publications.findOne({_id:val});
                if(publications)return publications.title;
            }
        },
        {
            key: '_id',
            title: 'ISSN',
            transform: function(val, doc) {
                var publications = Publications.findOne({_id:val});
                if(publications)return publications.issn;
            }
        },
        {
            key: '_id',
            title: 'EISSN',
            transform: function(val, doc) {
                var publications = Publications.findOne({_id:val});
                if(publications)return publications.EISSN;
            }
        },
        {
            key: '_id',
            title: 'PUBLISHER',
            transform: function(val, doc) {
                var publications = Publications.findOne({_id:val});
                if(publications){
                    var publisher = Publishers.findOne({_id:publications.publisher});
                    if(publisher)return publisher.name;
                }
            }
        },
        {
            key: 'total',
            title: 'CLICK TIMES TOTAL'
        },
        {
            key: 'dateCode',
            title: 'DATE'
        }
    ];
    //console.dir(data);
    return Excel.export(fileName, fields, data);
}

Science.Reports.getJournalReportData = function (query) {
    //get each view by journal counting each reoccurence
    var audit = PageViews.aggregate([
        {
            $match: {action: "journalBrowse"}
        },
        {
            $group: {_id: '$journalId', total: {$sum: 1}}
        }, {$sort: {total: -1}}

    ]);
    //for each result get metadate then pull monthly data
    _.each(audit, function (x) {
        var journal = Publications.findOne({_id: x._id});
        x.publisher = Publishers.findOne({_id:journal.publisher}).name;
        x.title = journal.title;
        x.issn = journal.issn;
        var months =PageViews.aggregate(
            [
                {$match: {
                    $and: [
                        {action: "journalBrowse"},
                        {journalId: x._id}
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