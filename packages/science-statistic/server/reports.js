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
    //var data = PageViews.find(query).fetch();
    var data = PageViews.aggregate([
            {
                $match: {
                    $and: [query]
                }
            },
            {
                $group: {_id: '$journalId',total: {$sum: 1}}
            }
        ]);
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