//Template.reports.rendered = function () {
//    Tracker.autorun(function () {
//        buildReports();
//    })
//}
Template.reports.helpers({
    totalConcurrentUsers: function () {
        return Users.userStatusSessions.find().count();
    },
    totalRegisteredUsers: function () {
        return Users.find().count();
    },
    totalPublishers: function () {
        return Publishers.find().count();
    },
    totalJournals: function () {
        return Publications.find().count();
    },
    totalArticles: function () {
        Meteor.call("totalArticles", function (e, r) {
            if (!e)return Session.set("totalArticles", r);
        });
        return Session.get("totalArticles");
    },
    topGenresChart: function () {
        return {
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Users.userStatusSessions.find().count()
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: "Total users"
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br>' +
                        Highcharts.numberFormat(this.y, 2);
                }

            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                type: 'spline',
                name: 'genre',
                data: (function () {
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Users.userStatusSessions.find().count()
                        });
                    }
                    return data;
                })()
            }]
        };
    }
});
