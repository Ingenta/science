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