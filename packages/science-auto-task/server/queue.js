Science.Queue = {
	Citation:new PowerQueue({
		maxProcessing: 10,//10并发
		maxFailures:3, //对失败的子任务重试2次（加上第一次失败共3次）

	})
};

Science.Queue.Citation.errorHandler = function(data){
	SubTasks.update({_id:data.id},{$set:{status:"failed"}});
	AutoTasks.update({_id:data.taskId},{$set:{
		failed:Science.Queue.Citation.failures()+Science.Queue.Citation.errors(),
		queueTotal:Science.Queue.Citation.total()
	}});
};

Science.Queue.Citation.taskHandler = function(data,next){
	AutoTasks.update({_id:data.taskId},{$set:{processing:Science.Queue.Citation.processing(),status:"processing"}});
	SubTasks.update({_id:data.id},{$set:{ status : "processing"}});
	Science.Interface.CrossRef.getCitedBy(data.doi,Meteor.bindEnvironment(function(crErr,crResult){
		if(crErr || !crResult || !crResult.length){
			Science.Interface.Springer.getCitedBy(data.doi,Meteor.bindEnvironment(function(spErr,spResult){
				if(spErr){
					next(new Meteor.Error('something wrong'));
				}else if (!spResult || !spResult.length){
					AutoTasks.update({_id:data.taskId},{$inc:{success:1}});
				}else{
					Articles.update({doi:data.doi},{$set:{citations:spResult}});
					SubTasks.update({_id:data.id},{$set:{status:"success",from:"springer"}});
					AutoTasks.update({_id:data.taskId},{$inc:{success:1},$set:{processing:Science.Queue.Citation.processing()}});
				}
			}))
		}else{
			Articles.update({doi:data.doi},{$set:{citations:crResult}});
			SubTasks.update({_id:data.id},{$set:{status:"success",from:"crossref"}});
			AutoTasks.update({_id:data.taskId},{$inc:{success:1}});
		}
		next();
	}))
};

Science.Queue.Citation.onEnded = function(){
	AutoTasks.update({_id:Science.Queue.Citation.taskId},{$set:{status:"ended",processing:0}});
}