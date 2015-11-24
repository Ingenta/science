/*
 * Call the function to built the chart when the template is rendered
 */
Template.MetricsTemplate.rendered = function () {
    var article = Articles.findOne({articledoi: Router.current().params.articleDoi}, {fields: {_id: 1}});
    if (!article || !article._id)return;

    buildHitCounterChart(article._id);
    buildHitCounterGraph(article._id);
    
    //TODO: consider only calling if location report data is older than a day?
    Meteor.call("getLocationReport", "fulltext", article._id, function (err, arr) {
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
}


var buildHitCounterChart = function (articleId) {
    var data = new Array();
    data.push({
        name: TAPi18n.__('Abstract Views'),
        y: PageViews.find({action: "abstract", articleId: articleId}).count()
    });

    data.push({
        name: TAPi18n.__('Full text Views'),
        y: PageViews.find({action: "fulltext", articleId: articleId}).count()
    });

    data.push({
        name: TAPi18n.__('PDF Downloads'),
        y: PageViews.find({action: "pdfDownload", articleId: articleId}).count()
    });

    $('#container-pie').highcharts({

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
                    enabled: false
                    //format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    //                style: {
                    //                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    //                },
                    //connectorColor: 'silver'
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
                    enabled: false
                    //format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    //                style: {
                    //                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    //                },
                    //connectorColor: 'silver'
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


function buildHitCounterGraph(articleId) {
    var currentDate = new Date;
    var a = new Array();
    var f = new Array();
    var c = new Array();

    var m = [];
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (i = 1; i <= 12; i++) {
        var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        a.unshift(PageViews.find({
            action: "abstract",
            articleId: articleId,
            when: {$gte: startDate, $lt: endDate}
        }).count());
        f.unshift(PageViews.find({
            action: "fulltext",
            articleId: articleId,
            when: {$gte: startDate, $lt: endDate}
        }).count());
        m.unshift(month[currentDate.getMonth() % 12] + currentDate.getFullYear());
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    $.each(a, function (index, el) {
        var value = el + f[index];
        c.push(value);
    });

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
            categories: m
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
            name: 'abstract',
            data: a
        }, {
            name: 'fulltext',
            data: f
        }, {
            name: 'combined',
            data: c
        }]
    });
}
