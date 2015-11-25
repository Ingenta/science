Template.AdminLogs.helpers({
    recentLogs: function () {
        return Logs.find();
    }
});