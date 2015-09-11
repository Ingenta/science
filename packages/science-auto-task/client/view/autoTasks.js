ReactiveTabs.createInterface({
	template: 'autoTaskTabs',
	onChange: function (slug, template) {
		// This callback runs every time a tab changes.
		// The `template` instance is unique per {{#basicTabs}} block.
		//console.log('[tabs] Tab has changed! Current tab:', slug);
		//console.log('[tabs] Template instance calling onChange:', template);
	}
});

Template.autoTask.helpers({
	tabs: function () {
		return [
			{name: TAPi18n.__("doi_register"), slug: 'doi'},
			{name: TAPi18n.__("update_citation"), slug: 'citation'}
		]
	},
	activeTab: function () {

		return Session.get('activeTab');
	}
});
