ReactiveTabs.createInterface({
	template: 'addArticleTabs',
	onChange: function (slug, template) {
		// This callback runs every time a tab changes.
		// The `template` instance is unique per {{#basicTabs}} block.
		console.log('[tabs] Tab has changed! Current tab:', slug);
		console.log('[tabs] Template instance calling onChange:', template);
	}
});

Template.addArticleTabsTemp.helpers({
	tabs:function(){
		return [
			{name:'add',slug:'add'},
			{name:'inside',slug:'inside'}
		]
	},
	activeTab: function () {
		return Session.get('activeTab');
	}
});
