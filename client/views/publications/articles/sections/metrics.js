//TODO: distinct chart data on userid
//TODO: consider only calling if location report data is older than a day?
// Template.MetricsTemplate.rendered = function () {
//     var article = Articles.findOne({articledoi: Router.current().params.articleDoi}, {fields: {_id: 1}});
//     if (!article || !article._id)return;
//
//     Meteor.call("getArticlePageViewsPieChartData", article._id, function (err, response) {
//         buildHitCounterChart(response);
//     });
//
//     //Meteor.call("getArticlePageViewsGraphData", article._id, function (err, response) {
//     //    buildHitCounterGraph(response);
//     //});
//
//     Meteor.call("getArticlePageLocationReport", "fulltext", article._id, function (err, arr) {
//         var data = new Array();
//         var index = 0;
//         _.each(arr, function (obj) {
//             index++;
//             if (obj.name) {
//                 data.push({
//                     name: TAPi18n.getLanguage() === "zh-CN" ? obj.name.cn : obj.name.en,
//                     y: obj.locationCount
//                 });
//             }
//         });
//         buildLocationChart(data);
//     });
// }
prepareMetricsForThisArticle = function(){
    var article = Articles.findOne({articledoi: Router.current().params.articleDoi.replace(/-slash-/g,"/")}, {fields: {_id: 1}});
    if (!article || !article._id)return;

    Meteor.call("getArticlePageViewsPieChartData", article._id, function (err, response) {
        buildHitCounterChart(response);
    });
    Meteor.call("getArticlePageLocationReport", "fulltext", article._id, function (err, arr) {
        var data = new Array();
        var index = 0;
        _.each(arr, function (obj) {
            index++;
            if (obj.name) {
                data.push({
                    name: TAPi18n.getLanguage() === "zh-CN" ? obj.name.cn : obj.name.en,
                    y: obj.locationCount
                });
            }
        });
        buildLocationChart(data);
    });
    Meteor.call("getArticlePageViewsGraphData", article._id, function (err, response) {
        buildHitCounterGraph(response);
    });
}

var buildHitCounterChart = function (data) {

    $('#container-pie').highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
            '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#7cb5ec', '#434348', '#90ed7d', '#f7a35c',                                                                  // 1253
            '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        title: {
            text: ''
        },

        credits: {
            enabled: false
        },

        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },

        series: [{
            type: 'pie',
            name: 'views',
            data: data
        }]
    });
};


var buildLocationChart = function (data) {
    $('#container-location').highcharts({

        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },

        title: {
            text: ''
        },

        credits: {
            enabled: false
        },

        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },

        series: [{
            name: 'views',
            data: data
        }]
    });
};


function buildHitCounterGraph(data) {


    $('#container-area').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: data.months
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name:  TAPi18n.__("abstract"),
            data: data.abstract
        }, {
            name: TAPi18n.__("fulltext"),
            data: data.fulltext
        },{
            name: TAPi18n.__("download"),
            data: data.download
        }, {
            name: TAPi18n.__("combined"),
            data: data.total
        }]
    });
}
