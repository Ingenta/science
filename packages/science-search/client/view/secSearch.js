Template.secSearch.events({
	'click .btn-primary':function(e){
		var ele =  Template.instance().$("#secSearchInput");
		var searchval =ele.val();
		ele.val("");
		//NOTE: if refine search value is empty don't perform the search
		if(!searchval)return;
		SolrQuery.addSecondQuery(searchval);
		var setting = SolrQuery.params("st") || {};
		setting.start = 0
		SolrQuery.params("st",setting);
		Router.go(SolrQuery.makeUrl());
	},
	'click .sq-reset':function(e){
		e.preventDefault();
		SolrQuery.resetSecQuery();
		Router.go(SolrQuery.makeUrl());
	}
})

Template.secSearch.helpers({
	hasSecCond:function(){
		return !_.isEmpty(SolrQuery.params("sq"));
	}
})