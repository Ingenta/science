/*
 * Call the function to built the chart when the template is rendered
 */
Template.MetricsTemplate.rendered = function () {
    Tracker.autorun(function () {
        buildPieChart();
    });
}

Template.MetricsTemplate.helpers({
    number: function () {
        return CountArticle.find().count();
    }
});

var chart;
var buildPieChart = function()
{
    var data = new Array();
    data.push({
        name:  TAPi18n.__('Abstract Views'),
        y: CountArticle.find({action  :"abstract"}).count(),
        color: '#55BF3B'
    });

    data.push({
        name: TAPi18n.__('Full text Views'),
        y:  CountArticle.find({action  :"fulltext"}).count(),
        color: '#DDDF0D'
    });

    data.push({
        name: TAPi18n.__('PDF Downloads'),
        y: CountArticle.find({action  :"pdfDownload"}).count(),
        color: '#DF5353'
    });

    if(Session.get('reactive') !== undefined)
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

        //credits: {
        //    enabled: false
        //},

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
