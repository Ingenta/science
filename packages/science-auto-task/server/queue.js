Science.Queue = {
	Citation:new PowerQueue({
		maxProcessing: 10,//10并发
		maxFailures: 3 //对失败的子任务重试2次（加上第一次失败共3次）
	})
};

Science.Queue.Citation.errorHandler = function(data){
	logger.info("got error from updateCitation Queue");
	SubTasks.update({_id:data.id},{$set:{status:"error"}});
	AutoTasks.update({_id:data.taskId},{$set:{
		failed:Science.Queue.Citation.failures()+Science.Queue.Citation.errors(),
		queueTotal:Science.Queue.Citation.total()
	}});
};

Science.Queue.Citation.taskHandler = function(data,next){
	logger.info("updating citation of doi:"+data.doi);
	AutoTasks.update({_id:data.taskId},{$set:{processing:Science.Queue.Citation.processing(),status:"processing"}});
	SubTasks.update({_id:data.id},{$set:{ status : "processing"}});
	Science.Interface.WebOfScience.amr(data.doi,Meteor.bindEnvironment(function(err,result){
		logger.info("got result from Web of Science AMR");
		if(!err && result && data.doi==result.doi){
			logger.info("save AMR information to db");
			var amrObj = {};
			amrObj.info = result;
			amrObj.updatedAt = new Date();
			Articles.update({doi:data.doi},{$set:{webOfScience:amrObj}});
		}
	}));
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
					Articles.update({doi:data.doi},{$set:{citations:spResult, citationCount:spResult.length}});
					SubTasks.update({_id:data.id},{$set:{status:"success",from:"springer"}});
					AutoTasks.update({_id:data.taskId},{$inc:{success:1},$set:{processing:Science.Queue.Citation.processing()}});
					logger.info("got ["+ spResult.length+"] citations from Springer for doi:"+ data.doi);
					spResult.forEach(function (item) {
						if (!Citations.find({doi: data.doi, 'citation.doi': item.doi}).count())
							Citations.insert({doi: data.doi, articleId:data.articleId, citation: item, source: 'springer', createdAt: new Date()});
					})
				}
				next();
			}))
		}else{
			Articles.update({doi:data.doi},{$set:{citations:crResult, citationCount:crResult.length}});
			SubTasks.update({_id:data.id},{$set:{status:"success",from:"crossref"}});
			AutoTasks.update({_id:data.taskId},{$inc:{success:1}});
			logger.info("got ["+ crResult.length+"] citations from CrossRef for doi:"+ data.doi);
			crResult.forEach(function (item) {
				if (!Citations.find({doi: data.doi, 'citation.doi': item.doi}).count())
					Citations.insert({doi: data.doi, articleId:data.articleId, citation: item, source: 'crossref', createdAt: new Date()});
			});
			next();
		}
	}))
};

Science.Queue.Citation.onEnded = function(){
	AutoTasks.update({_id:Science.Queue.Citation.taskId},{$set:{status:"ended",processing:0}});
	updateMostCited && updateMostCited();
};