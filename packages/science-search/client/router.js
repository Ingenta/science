Router.route('/search', {
	name:"solrsearch",
	template: "SolrSearchResults",
	parent: "home",
	title: function () {
		return TAPi18n.__("Search");
	},
	waitOn: function () {
		return [
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articleSearchResults'),
			Meteor.subscribe('keywords'),
			Meteor.subscribe('topics')
		]
	},
	onBeforeAction:function(){
		SolrQuery.callSearchMethod();
		this.next();
	}
});