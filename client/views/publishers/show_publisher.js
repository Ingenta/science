ReactiveTabs.createInterface({
    template: 'publisherTabs'
});

Template.publisherOptions.helpers({
    tabs: function () {
        return [
            {name: TAPi18n.__("Journals"), slug: 'journals'},
            {name: TAPi18n.__("Collections"), slug: 'collections'}
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});