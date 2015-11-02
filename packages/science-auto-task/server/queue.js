Science.Queue = {
	Citation:new PowerQueue({
		maxProcessing: 10,//10并发
		maxFailures: 3 //对失败的子任务重试2次（加上第一次失败共3次）
	})
};

Science.Queue.Citation.errorHandler = function(data){
	SubTasks.update({_id:data.id},{$set:{status:"error"}});
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
					SubTasks.update({_id:data.id},{$set:{status:"error"}});
					AutoTasks.update({_id:data.taskId},{$set:{
						failed:Science.Queue.Citation.failures()+Science.Queue.Citation.errors(),
						queueTotal:Science.Queue.Citation.total()
					}});
					//errorHandler和Meteor.bindEnvironment配合使用似乎有问题,
					//在发生错误时不能正确调用到errorHandler方法,所以不使用errorHandler来处理异常了.
					//next(new Meteor.Error('something wrong'));
				}else if (!spResult || !spResult.length){
					AutoTasks.update({_id:data.taskId},{$inc:{success:1}});
				}else{
					Articles.update({doi:data.doi},{$set:{citations:spResult}});
					SubTasks.update({_id:data.id},{$set:{status:"success",from:"springer"}});
					AutoTasks.update({_id:data.taskId},{$inc:{success:1},$set:{processing:Science.Queue.Citation.processing()}});

					spResult.forEach(function (item) {
						if (!Citations.find({doi: data.doi, 'citation.doi': item.doi}).count())
							Citations.insert({doi: data.doi, articleId:data.articleId, citation: item, source: 'springer', createdAt: new Date()});
					})
				}
			}))
		}else{
			Articles.update({doi:data.doi},{$set:{citations:crResult}});
			SubTasks.update({_id:data.id},{$set:{status:"success",from:"crossref"}});
			AutoTasks.update({_id:data.taskId},{$inc:{success:1}});

			crResult.forEach(function (item) {
				if (!Citations.find({doi: data.doi, 'citation.doi': item.doi}).count())
					Citations.insert({doi: data.doi, articleId:data.articleId, citation: item, source: 'crossref', createdAt: new Date()});
			});
		}
		next();
	}))
};

Science.Queue.Citation.onEnded = function(){
	AutoTasks.update({_id:Science.Queue.Citation.taskId},{$set:{status:"ended",processing:0}});

	MostCited.remove({});
	var citations = Articles.find({citations: {$exists: true}}, {$sort: {'citations.size': -1}, limit: 20});
	citations.forEach(function (item) {
	    MostCited.insert({
	        articleId: item._id,
	        title: item.title,
	        count: item.citations.length,
	        journalId: item.journalId
	    });
	});
}