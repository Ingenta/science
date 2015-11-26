Template.AdminLogs.helpers({
    recentLogs: function () {
        return Logs.find();
    },
    metaToString: function (meta) {
        return JSON.stringify(meta, null, '\t');
    },
    getLevelClass: function(level){
        if (level==="error") return "bg-danger";
        if (level==="warn") return "bg-warning";
        return "";
    }
});
Template.AdminLogs.events({
    'click .metaLogPopOver': function (e) {
        $(e.target).popover('show')
    }
});