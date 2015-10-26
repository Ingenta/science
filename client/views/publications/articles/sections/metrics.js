/*
 * Call the function to built the chart when the template is rendered
 */
Template.MetricsTemplate.rendered = function () {
    Tracker.autorun(function () {
        buildPieChart();
        builtArea();
        buildPieChart2();
    });
}


var chart;
var buildPieChart = function () {
    var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
    var article = Articles.findOne({doi: currentDoi});
    if (!article)return;
    var articleId = article._id;
    if (!articleId)return;
    var data = new Array();
    data.push({
        name: TAPi18n.__('Abstract Views'),
        y: ArticleViews.find({action: "abstract", articleId: articleId}).count(),
        color: '#55BF3B'
    });

    data.push({
        name: TAPi18n.__('Full text Views'),
        y: ArticleViews.find({action: "fulltext", articleId: articleId}).count(),
        color: '#DDDF0D'
    });

    data.push({
        name: TAPi18n.__('PDF Downloads'),
        y: ArticleViews.find({action: "pdfDownload", articleId: articleId}).count(),
        color: '#DF5353'
    });

    if (Session.get('reactive') !== undefined)
        data = Session.get('reactive');

    chart = $('#container-pie').highcharts({

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


var buildPieChart2 = function () {
    var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
    var article = Articles.findOne({doi: currentDoi});
    if (!article)return;
    var articleId = article._id;
    if (!articleId)return;
    var data = new Array();
    Meteor.call("getLocationReport", "fulltext", articleId, function (err, arr) {
        var colors=['#DDDF0D','#DD000D','#00DF0D','#DDDFFF'];
        var index=0;
        _.each(arr,function (obj) {
            var color=colors[ index % colors.length ];
            index++;
            if(obj.name) {
                data.push({
                    name: TAPi18n.getLanguage() === "zh-CN" ? obj.name.cn : obj.name.en,
                    y: obj.localCount,
                    color: color
                });
            }
      });
        Session.set('reactive2', data);
    });

    chart = $('#container').highcharts({

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
            data: Session.get('reactive2')
        }]
    });
};
/*
 * Function to draw the area chart
 */

function builtArea() {
    var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
    var article = Articles.findOne({doi: currentDoi});
    if (!article)return;
    var articleId = article._id;
    if (!articleId)return;
    var data = new Array();

    var currentDate = new Date;
    var a = new Array();
    var f = new Array();
    var c = new Array();

    var m = [];
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for(i=1; i<=12; i++){
        var startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
        var endDate = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0);
        a.unshift(ArticleViews.find({action: "abstract", articleId: articleId, when: {$gte:startDate, $lt:endDate}}).count());
        f.unshift(ArticleViews.find({action: "fulltext", articleId: articleId, when: {$gte:startDate, $lt:endDate}}).count());
        m.unshift(month[currentDate.getMonth()%12]+currentDate.getFullYear());
        currentDate.setMonth(currentDate.getMonth()-1);
    };

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
