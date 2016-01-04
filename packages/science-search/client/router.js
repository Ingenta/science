Router.route('/search', {
	name:"solrsearch",
	template: "SolrSearchResults",
	parent: "home",
	title: function () {
		return TAPi18n.__("Search");
	},
	waitOn: function () {
		return [
			Meteor.subscribe('keywords'),
			Meteor.subscribe('topics')
		]
	},
	onBeforeAction:function(){
		$(".slimScrollDiv").remove();
		SolrQuery.callSearchMethod();
		this.next();
	}
});