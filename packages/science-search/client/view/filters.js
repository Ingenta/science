Template.solrFilterItem.events({
	'click a':function(e){
		e.preventDefault();
		var fq=SolrQuery.session.get("filterQuery") || [];
		if(this.selStatus){
			fq = _.without(fq,this.fq);
		}else{
			fq = _.union(fq,this.fq)
		}
		SolrQuery.addFilterQuery(fq);
		Router.go(SolrQuery.makeUrl());
	}
});

Template.solrFilterItem.helpers({
	class:function(){
		var fq=SolrQuery.getSetting("filterQuery");
		this.selStatus= _.contains(fq,this.fq);
		return this.selStatus?"fa fa-mail-reply":"fa fa-mail-forward";
	}
})