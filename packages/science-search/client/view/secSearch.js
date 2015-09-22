Template.secSearch.events({
	'click .btn-primary':function(e){
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
		return !_.isEmpty(SolrQuery.params("sq"));
	}
})