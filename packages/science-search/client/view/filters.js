var pageSetting = new ReactiveDict();
var itemLimit = 10;
Template.solrFilterItem.events({
	'click .filter-me':function(e){
		e.preventDefault();
		SolrQuery.toggleFilterQuery(this.field,this.val,!this.selStatus);
		Router.go(SolrQuery.makeUrl());
	},
	'click .show-more':function(e){
		e.preventDefault();
		pageSetting.set(this.name,-1);// no limited
		Template.instance().$(".slimScroll").slimScroll({
			height:'200px'
		})
	}
});

Template.solrFilterItem.helpers({
	class:function() {
		var fq         = SolrQuery.params("fq");
		fq             = fq && fq[this.field];
		this.selStatus = fq ? _.contains(fq, this.val) : false;
		return this.selStatus ? "fa fa-mail-reply" : "fa fa-mail-forward";
	},
	getFilterOptions:function() {
		if(_.isEmpty(this.filterOptions))
			return;
		var scount = pageSetting.get(this.name) || itemLimit;
		return _.first(this.filterOptions,scount);
	},
	isTooMany:function(){
		return pageSetting.get(this.name)!=-1 && this.filterOptions.length> itemLimit;
	}
});

Template.solrFilterItem.onRendered(function(){
	var filterName = this.data.name;
	if(!filterName)
		return;
	var currLimit = pageSetting.get(filterName);
	if(currLimit==-1){
		Template.instance().$(".slimScroll").slimScroll({
			height:'200px'
		});
	}
});