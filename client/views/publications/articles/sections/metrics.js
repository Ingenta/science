Template.MetricsTemplate.helpers({
    number: function () {
       return CountArticle.find().count();
    }
});
Template.MetricsTemplate.topGenresChart = function() {
    var data =[
        ['abstract',   CountArticle.find({action  :"abstract"}).count()],
        ['fulltext',    CountArticle.find({action  :"fulltext"}).count()],
        ['pdfDownload',     CountArticle.find({action  :"pdfDownload"}).count()]];
    if(Session.get('reactive') !== undefined)
        data = Session.get('reactive');
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
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
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'genre',
            data: data

        }]
    };
};