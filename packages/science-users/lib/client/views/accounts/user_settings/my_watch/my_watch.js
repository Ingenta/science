ReactiveTabs.createInterface({
    template: 'watchTabs'
});

Template.watchOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Article Watch"), slug: 'article'},
            {name: TAPi18n.__("Journal Watch"), slug: 'journal'},
            {name: TAPi18n.__("Topic Watch"), slug: 'topic'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});