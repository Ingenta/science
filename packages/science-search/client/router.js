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
			Meteor.subscribe('articles')
		]
	}
});