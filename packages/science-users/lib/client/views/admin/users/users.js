ReactiveTabs.createInterface({
	template: 'accountTabs',
	onChange: function (slug) {
		if(slug !== Session.get('activeTab'))
			Session.set('activeTab', slug);
	}
});


Template.accountOptions.helpers({
	tabs: function () {
		return [
			{name: TAPi18n.__("Admin"), slug: 'admin'},
			{name: TAPi18n.__("Normal User"), slug: 'normal'},
			{name: TAPi18n.__("Publisher"), slug: 'publisher'},
			{name: TAPi18n.__("Institution"), slug: 'institution'}
		];
	},
	activeTab: function () {
		return Session.get('activeTab');
	}
});

