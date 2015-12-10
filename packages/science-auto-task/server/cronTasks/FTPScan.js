SyncedCron.add({
    name: 'FTPSCAN',
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.FTPSCAN.rate || "every 30 minutes");//默认每30分钟检查一次
    },
    job: function () {
        Tasks.scanFTP();
    }
});

