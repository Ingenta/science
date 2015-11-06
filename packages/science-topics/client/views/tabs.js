ReactiveTabs.createInterface({
    template: 'addArticleToTopicsTabs',
    onChange: function (slug, template) {
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
