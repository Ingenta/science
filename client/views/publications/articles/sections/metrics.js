/*
 * Call the function to built the chart when the template is rendered
 */
Template.MetricsTemplate.rendered = function () {
    Tracker.autorun(function () {
        buildPieChart();
        builtArea();
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
                    enabled: false,
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
}
/*
 * Function to draw the area chart
 */
function builtArea() {

    $('#container-area').highcharts({

        chart: {
            type: 'area'
        },

        title: {
            text: ''
        },

        credits: {
            enabled: false
        },

        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            }
        },

        yAxis: {
            title: {
                text: '# of Views'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000 + 'k';
                }
            }
        },

        tooltip: {
            pointFormat: '<b>{point.y:,.0f}</b> {series.name} in {point.x}'
        },

        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },

        series: [{
            name: 'Abstract Views',
            data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
        }, {
            name: 'Article Views',
            data: [null, null, null, null, null, null, null, null, null, null,
                5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                21000, 20000, 19000, 18000, 18000, 17000, 16000]
        }]
    });
}
