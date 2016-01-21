Router.route('/search', {
	name:"solrsearch",
	template: "SolrSearchResults",
	parent: "home",
	title: function () {
		return TAPi18n.__("Search");
	},
	waitOn: function () {
		return [
			HomePageSubs.subscribe('topics')
		]
	},
	onBeforeAction:function(){
		$(".slimScrollDiv").remove();
		SolrQuery.callSearchMethod();
		this.next();
	}
});