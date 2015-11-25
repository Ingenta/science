Template.AdminLogs.helpers({
    recentLogs: function () {
        return Logs.find();
    },
    metaToString: function (meta) {
        return JSON.stringify(meta, null, '\t');
    }
});
Template.AdminLogs.events({
    'click .metaLogPopOver': function (e) {
        $(e.target).popover('show')
    }
});