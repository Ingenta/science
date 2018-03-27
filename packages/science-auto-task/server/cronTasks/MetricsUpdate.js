SyncedCron.add({
    name: "MetricsUpdate",
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.Metrics.rate || "at 2:00 am except on Sat");//默认每周六凌晨2点执行
    },
    job: function () {
        Science.Queue.Metrics.reset();
        var articles = Articles.find({}, {fields: {doi: 1}});
        articles.forEach(function (item) {
            Science.Queue.Metrics.add({doi: item.doi, articleId: item._id});
        });
    }
});