Meteor.startup(function(){
	//注册一个搜索前被触发的函数
	SolrClient.beforeSearch(function(params){
		if(params.st && params.st.from == 'bar'){
			SearchLog.update({str: params.q}, {$inc: {count: 1}}, 1);
		}
	});
});
