SyncedCron.add({
	name:'DOI Register(注册DOI)',
	schedule: function(parser){
		return parser.text(Config.AutoTasks.DOI_Register.rate || "at 1:00am every day");
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
	name:"Update Citations(引用)",
	schedule:function(parser){
		return parser.text("every 30 sec");
	},
	job:function(){
		Science.Queue.Citation.reset();
		var taskId = AutoTasks.insert({type: "update_citation",status: "creating",createOn: new Date()});

		var articles = Articles.find({},{fields:{doi:1}});
		var index = 0;
		//articles.forEach(function(item){
		//	var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
		//	Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
		//})
		var item = {doi:'10.1360/972010-666'};
		for(var ii=0;ii<100;ii++){
			var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
			Science.Queue.Citation.add({id:stId,taskId:taskId,doi:item.doi});
		}
		AutoTasks.update({_id:taskId},{$set:{status:"created",total:100}});
		Science.Queue.Citation.taskId = taskId;
		//SyncedCron.stop();
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