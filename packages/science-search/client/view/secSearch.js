Template.secSearch.events({
	'click .btn-success':function(e){
		var ele =  Template.instance().$("#secSearchInput")
		var searchval =ele.val();
		ele.val("");
		SolrQuery.addSecQuery(searchval);
	}
})