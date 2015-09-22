Template.secSearch.events({
	'click .btn-success':function(e){
		var ele =  Template.instance().$("#secSearchInput");
		var searchval =ele.val();
		ele.val("");
		SolrQuery.addSecondQuery(searchval);
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
		return !!SolrQuery.get("secondQuery");
	}
})