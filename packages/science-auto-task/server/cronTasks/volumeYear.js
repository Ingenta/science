SyncedCron.add({
    name: 'VolumeYear',
    schedule: function (parser) {
        return parser.text(Config.AutoTasks.VolumeYear.rate || "at 3:00 am");//默认每天凌晨3点检查一次
    },
    job: function () {
        updateVolumeYear();
    }
});