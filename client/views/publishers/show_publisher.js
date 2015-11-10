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

Template.ShowPublisher.helpers({
    notUrl: function () {
        var publisherId = Session.get("currentPublisherId");
        if (Publishers.findOne({_id: publisherId}).agree)return "/miniplatform";
    }
});