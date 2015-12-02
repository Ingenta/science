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
    var data = Science.Reports.getJournalReportDataNew(query);
    //console.dir(data);
    var fields = [
        {
            key: 'title',
            title: 'TITLE'
        },
        {
            key: 'publisher',
            title: 'PUBLISHER'
        },
        {
            key: 'issn',
            title: 'ISSN',
            width: 10
        },
        {
            key: 'issn',
            title: 'EISSN',
            width: 10
        },
        {
            key: 'total',
            title: 'TOTAL',
            width: 7,
            type: 'number'
        }
    ];
    //if we take now year-month, then create and array of each going back 12 months then each

    _.each(['201509', '201510','201511', '201512'], function (item) {
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
    //console.dir(data);
    return Excel.export(fileName, fields, data);
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
    console.log(query);
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
            return myFuture.return(result)
            console.dir(result);

        }
    );
    return myFuture.wait();
}