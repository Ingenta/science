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
    },
    getPublisherId: function () {
        return Router.current().data()._id;
    }
});

Template.ShowPublisher.helpers({
    newsUrl: function () {
        var shortName = Router.current().params.publisherName;
        if(shortName==Config.defaultPublisherShortName){
            return "/miniplatform";
        }
    }
});