Science.metricsQueue = {
	Metrics:new PowerQueue({
		maxProcessing: 10,//10并发
		maxFailures: 3 //对失败的子任务重试2次（加上第一次失败共3次）
	})
};

Science.metricsQueue.Metrics.errorHandler = function(data){
	logger.info("got error from updateMetrics Queue doi:"+data.doi);
};

Science.metricsQueue.Metrics.taskHandler = function(data,next){
	logger.info("updating metrics of doi:"+data.doi);
	Meteor.call("getArticlePageViewsPieChartData", data.articleId, function (err, response) {
		var count = MetricsCount.find({articleId:data.articleId}, {fields: {_id: 1}});
		if(count){
			count.forEach(function (item) {
				MetricsCount.remove({_id:item._id});
			});
		}
		MetricsCount.insert({articleId: data.articleId, dataCount: response, type: "1", createDate:new Date()});
	});
	Meteor.call("getArticlePageLocationReport", "fulltext", data.articleId, function (err, arr) {
		MetricsCount.insert({articleId: data.articleId, dataCount: arr, type: "2", createDate:new Date()});
	});
	Meteor.call("getArticlePageViewsGraphData", data.articleId, function (err, response) {
		MetricsCount.insert({articleId: data.articleId, dataCount: response,type: "3",createDate:new Date()});
	});
	next();
};

Science.metricsQueue.Metrics.onEnded = function(){
	logger.info("update metrics Queue success");
};