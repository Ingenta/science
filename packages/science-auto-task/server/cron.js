


var abortUnfinishTask = function () {
    AutoTasks.update({status: {$nin: ["ended", "aborted"]}}, {$set: {status: "aborted", processing: 0}}, {multi: true});
};

Meteor.startup(function () {
    abortUnfinishTask();
    SyncedCron.config({
        logger: function (opts) {
            logger.log(opts.level, opts.message, opts.tag)
        }
    });
    if (Config.AutoTasks.start)
        SyncedCron.start();
});

