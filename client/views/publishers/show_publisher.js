ReactiveTabs.createInterface({
    template: 'publisherTabs'
});

Template.publisherOptions.helpers({
    context: function () {
        var currentPublisher = Router.current().params.publisherName;
        return Publishers.findOne({name: currentPublisher});
    },
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