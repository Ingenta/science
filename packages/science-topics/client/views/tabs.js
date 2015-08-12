ReactiveTabs.createInterface({
    template: 'addArticleToTopicsTabs',
    onChange: function (slug, template) {
        // This callback runs every time a tab changes.
        // The `template` instance is unique per {{#basicTabs}} block.
        //console.log('[tabs] Tab has changed! Current tab:', slug);
        //console.log('[tabs] Template instance calling onChange:', template);
    }
});

Template.addArticleToTopicsTabsTemp.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("add article"), slug: 'add'},
            {name: TAPi18n.__("added articles"), slug: 'inside'}
        ]
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});
