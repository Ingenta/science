ReactiveTabs.createInterface({
    template: 'searchHistoryTabs',
    onChange: function (slug, template) {
    }
});
Template.UserSettingsSearchHistory.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Search History View"), slug: 'showsSearchHistory'},
            {name: TAPi18n.__("Search Folder Management"), slug: 'searchHistoryFolder'}
        ]
    },
    activeTab: function () {

        return Session.get('activeTab');
    }
});