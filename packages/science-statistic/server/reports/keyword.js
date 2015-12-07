//keyword
Science.Reports.getKeywordReportFile = function (query, fileName, start, end) {
    console.dir(query);
    var data = Science.Reports.getKeywordReportData(query);
    console.dir(data);
    var monthRange = Science.Reports.getLastTwelveMonths(start, end);
    var fields = Science.Reports.getKeywordReportFields(monthRange);
    return Excel.export(fileName, fields, data);
};
Science.Reports.getKeywordReportFields = function (monthRange) {
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
    _.each(monthRange, function (item) {
        fields.push({
            key: 'keyword',
            title: item.slice(0,4)+"-"+item.slice(4),
            width: 8,
            type: 'number',
            transform: function (val, doc) {
                if(!val)return 0;
                if(!val.months)return 0;
                if(!val.months[item])return 0;
                return val.months[item];
            }
        })
    });
    return fields;
};