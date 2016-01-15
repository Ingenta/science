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

SolrClient.triggerAfterSearch = function (params) {
	if(_.isEmpty(SolrClient.afterHooks))
		return;
	_.each(SolrClient.afterHooks,function(hook){
		hook && hook(params);
	})
};

SolrClient.afterSearch=function(func){
	if(!SolrClient.afterHooks){
		SolrClient.afterHooks = [];
	}
	if(_.isFunction(func))
		SolrClient.afterHooks.push(func);
}

Meteor.startup(function(){
	//注册搜索后合并期刊筛选的函数
	SolrClient.afterSearch(function(result){
		if(result.facet_counts && result.facet_counts.facet_fields && result.facet_counts.facet_fields.journalId){
			var journalFacetArr= result.facet_counts.facet_fields.journalId;
			var journalFacetObj={};
			var journalIdArr = [];
			for(var i= 0,j=1;i<journalFacetArr.length;i+=2,j+=2) {
				journalFacetObj[journalFacetArr[i]]=journalFacetArr[j];
				journalIdArr.push(journalFacetArr[i]);
			}
			var journals = Publications.find({_id:{$in:journalIdArr}},{fields: {historicalJournals: 1,visible:1}}).fetch();

			_.each(journalFacetObj,function(count,id){
				var journal = _.find(journals,function(j){return j._id===id});
				if(journal.visible=="0"){
					var newestJournal=_.find(journals,function(hj){return _.contains(hj.historicalJournals,id) && hj.visible=="1"});
					if(newestJournal)
						journalFacetObj[newestJournal._id] = (journalFacetObj[newestJournal._id] || 0 ) + count;
					delete journalFacetObj[id];
				}
			})
			journalFacetArr=[];
			_.each(journalFacetObj,function(count,id){
				journalFacetArr.push(id);
				journalFacetArr.push(count);
			})
			result.facet_counts.facet_fields.journalId=journalFacetArr;
		}
	})
});
