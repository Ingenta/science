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
    var data = PageViews.find(query).fetch();
    console.dir(data);
    var fields = [
        {
            key: 'journalId',
            title: 'Title',
            transform: function(val, doc) {
                var publications = Publications.findOne({_id:val});
                if(publications)return publications.title;
            }
        },
        {
            key: 'dateCode',
            title: 'Date'
        }
    ];
    //console.dir(data);
    return Excel.export(fileName, fields, data);
}