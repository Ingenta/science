if(process.env.RUN_TASKS_C) {
    SyncedCron.add({
        name: "CitationsUpdate",
        schedule: function (parser) {
            return parser.text(Config.AutoTasks.Citation.rate || "at 1:00 am except on Sat");//默认每周六凌晨1点执行
        },
        job: function () {
            Science.Queue.Citation.reset();
            var taskId = AutoTasks.insert({type: "update_citation", status: "creating", createOn: new Date()});

            var articles = Articles.find({}, {fields: {doi: 1}});
            var index = 0;
            articles.forEach(function (item) {
                var stId = SubTasks.insert({
                    taskId: taskId,
                    doi: item.doi,
                    index: index++,
                    status: "pending",
                    createOn: new Date()
                });
                Science.Queue.Citation.add({id: stId, taskId: taskId, doi: item.doi, articleId: item._id});
            });
            //var item = {doi:'10.1360/972010-666'};
            //for(var ii=0;ii<100;ii++){
            //	var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
            //	Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
            //}
            AutoTasks.update({_id: taskId}, {$set: {status: "created", total: articles.count()}});
            Science.Queue.Citation.taskId = taskId;
            //SyncedCron.stop();
        }
    });
}
Meteor.methods({
    fetchCitations:function(journalId){
        check(journalId, String);
        var articles = Articles.find({journalId:journalId}, {fields: {doi: 1}});
        articles.forEach(function (item) {
            Science.Queue.Citation.add({doi: item.doi, articleId: item._id});
        });
    }
})
