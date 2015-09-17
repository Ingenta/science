Template.solrFilterItem.events({
	'click a':function(e){
		e.preventDefault();
		var fq=SolrQuery.pageSession.get("filterQuery") || [];
		if(this.selStatus){
			fq = _.without(fq,this.fq);
		}else{
			fq = _.union(fq,this.fq)
		}
		SolrQuery.pageSession.set("filterQuery",fq);
		var sword=SolrQuery.pageSession.get('query');
		var fq = Science.queryStringify({fq:SolrQuery.pageSession.get("filterQuery")});
		Router.go('/search?q=' + sword+'&'+fq);
	}
});

Template.solrFilterItem.helpers({
	class:function(){
		var fq=SolrQuery.pageSession.get("filterQuery") || [];
		this.selStatus= _.contains(fq,this.fq);
		return this.selStatus?"fa fa-mail-reply":"fa fa-mail-forward";
	}
})