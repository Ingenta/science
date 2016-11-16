Router.route('/search', {
	name:"solrsearch",
	template: "SolrSearchResults",
	parent: "home",
	title: function () {
		return TAPi18n.__("Search");
	},
	onBeforeAction:function(){
		$(".slimScrollDiv").remove();
		SolrQuery.callSearchMethod();
		this.next();
	},
	waitOn: function () {
		return [
			Meteor.subscribe('contentType')
		]
	}
});