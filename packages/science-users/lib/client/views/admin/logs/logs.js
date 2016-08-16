Template.AdminLogs.helpers({
    recentLogs: function () {
        var numPerPage = Session.get('PerPage') || 10;
        return logsPagination.find({}, {itemsPerPage: numPerPage});
    },
    logsCount: function(){
        return Logs.find().count()>10;
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
    },
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
    }
});