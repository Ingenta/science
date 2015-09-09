Science.Queue = {
	Citation:new PowerQueue({
		maxProcessing: 10
	})
};
Science.Queue.Citation.errorHandler = function(data){
	SubTasks.update({_id:data.id},{$set:{ status : "error"}});
};
Science.Queue.Citation.taskHandler = function(data,next){
	SubTasks.update({_id:data.id},{$set:{ status : "processing"}});
	Science.Interface.CrossRef.getCitedBy(data.doi,Meteor.bindEnvironment(function(crErr,crResult){
		if(crErr || !crResult || !crResult.length){
			Science.Interface.Springer.getCitedBy(data.doi,Meteor.bindEnvironment(function(spErr,spResult){
				if(spErr || !spResult || !spResult.length){
					SubTasks.update({_id:data.id},{$set:{status:"failed"}});
				}else{
					Articles.update({doi:data.doi},{$set:{citations:spResult}});
					SubTasks.update({_id:data.id},{$set:{status:"done",from:"springer"}});
				}
			}))
		}else{
			Articles.update({doi:data.doi},{$set:{citations:crResult}});
			SubTasks.update({_id:data.id},{$set:{status:"done",from:"crossref"}});
		}
	}))
};


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
		return parser.text("every 10 sec");
	},
	job:function(){
		var taskId = AutoTasks.insert({type: "update_citation",status: "creating",createOn: new Date()});
		var articles = Articles.find({},{fields:{doi:1}});
		var index = 0;
		articles.forEach(function(item){
			var stId = SubTasks.insert({taskId:taskId,doi:item.doi,index:index++,status:"pending",createOn:new Date()});
			Science.Queue.Citation.add({id:stId,doi:item.doi});
		})
	}
});

Meteor.startup(function(){
	if(Config.AutoTasks.start)
		SyncedCron.start();
})