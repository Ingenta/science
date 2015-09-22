Template.solrFilterItem.events({
	'click a':function(e){
		e.preventDefault();
		SolrQuery.toggleFilterQuery(this.field,this.val,!this.selStatus);
		Router.go(SolrQuery.makeUrl());
	}
});

Template.solrFilterItem.helpers({
	class:function(){
		var fq=SolrQuery.params("fq");
		fq = fq && fq[this.field];
		this.selStatus=fq? _.contains(fq,this.val):false;
		return this.selStatus?"fa fa-mail-reply":"fa fa-mail-forward";
	}
});