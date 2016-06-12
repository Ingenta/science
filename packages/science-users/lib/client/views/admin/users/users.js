ReactiveTabs.createInterface({
	template: 'accountTabs',
	onChange: function (slug) {
		history.replaceState({},document.title,window.location.pathname + "?slug="+slug);
		//if(slug !== Session.get('activeTab'))
		//	Session.set('activeTab', slug);
	}
});


Template.accountOptions.helpers({
	tabs: function () {
		return [
			{name: TAPi18n.__("Admin"), slug: 'admin'},
			{name: TAPi18n.__("Normal User"), slug: 'normal'},
			{name: TAPi18n.__("Publisher"), slug: 'publisher'},
			{name: TAPi18n.__("Institutional Users"), slug: 'institution'}
		];
	},
	activeTab: function () {
		return Session.get('activeTab');
	}
});

Template.accountTabs.events({
	'click .tab-item':function(e){
		history.go(0);
	}
});