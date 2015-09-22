SyncedCron.add({
	name:'DOIRegister',
	schedule: function(parser){
		return parser.text(Config.AutoTasks.DOI_Register.rate || "at 1:00 am");//默认每天凌晨1点执行
	},
	job: function(){
		var taskId = AutoTasks.insert({type: "doi_register",status: "creating",createOn: new Date()});
		Science.Interface.CrossRef.register({
			taskId: taskId,
			recvEmail:Config.AutoTasks.DOI_Register.recvEmail,
			rootUrl:Config.AutoTasks.DOI_Register.rootUrl,
			condition:Config.AutoTasks.DOI_Register.condition
		});
	}
});

SyncedCron.add({
	name:"CitationsUpdate",
	schedule:function(parser){
		return parser.text(Config.AutoTasks.Citation.rate || "at 1:00 am except on Sat");//默认每周六凌晨1点执行
	},
	job:function(){
		Science.Queue.Citation.reset();
		var taskId = AutoTasks.insert({type: "update_citation",status: "creating",createOn: new Date()});

		var articles = Articles.find({},{fields:{doi:1}});
		var index = 0;
		articles.forEach(function(item){
			var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
			Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
		})
		//var item = {doi:'10.1360/972010-666'};
		//for(var ii=0;ii<100;ii++){
		//	var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
		//	Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
		//}
		AutoTasks.update({_id:taskId},{$set:{status:"created",total:articles.count()}});
		Science.Queue.Citation.taskId = taskId;
		//SyncedCron.stop();
	}
});

SyncedCron.add({
    name: "MostCitedTable",
    schedule: function (parser) {
        return parser.text("every 10 min");
    },
    job: function () {
        MostCited.remove({});
        var citations = Articles.find({citations: {$exists: true}}, {$sort: {'citations.size': -1}}, {limit: 5});
		citations.forEach(function (item) {
			MostCited.insert({title: item.title, count: item.citations.length});
		});
    }
});

var abortUnfinishTask = function(){
	AutoTasks.update({status:{$nin:["ended","aborted"]}},{$set:{status:"aborted",processing:0}},{multi:true});
}

Meteor.startup(function(){
	abortUnfinishTask();
	if(Config.AutoTasks.start)
		SyncedCron.start();
})