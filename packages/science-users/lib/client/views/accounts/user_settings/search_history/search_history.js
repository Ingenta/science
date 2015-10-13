ReactiveTabs.createInterface({
    template: 'searchHistoryTabs',
    onChange: function (slug, template) {
        // This callback runs every time a tab changes.
        // The `template` instance is unique per {{#basicTabs}} block.
        //console.log('[tabs] Tab has changed! Current tab:', slug);
        //console.log('[tabs] Template instance calling onChange:', template);
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