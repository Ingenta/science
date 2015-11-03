SolrClient.triggerBeforeSearch = function (params) {
	if(_.isEmpty(SolrClient.beforeHooks))
		return;
	_.each(SolrClient.beforeHooks,function(hook){
		hook && hook(params);
	})
};

SolrClient.beforeSearch=function(func){
	if(!SolrClient.beforeHooks){
		SolrClient.beforeHooks = [];
	}
	if(_.isFunction(func))
		SolrClient.beforeHooks.push(func);
}