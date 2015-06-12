ReactiveTabs.createInterface({
    template: 'articleTabs'
});

Template.articleOptions.helpers({
    context: function () {
        var currentTitle = Router.current().params.articleName;
        return Articles.findOne({title: currentTitle});
    },
    setCurrentPublication: function (id) {
        Session.set('currPublication', id);
    }
});

Template.articleOptions.helpers({
    tabs: function () {
        return [
            { name: TAPi18n.__("Abstract"), slug: 'abstract' },
            { name:  TAPi18n.__("Full Text"), slug: 'full text' },
            { name:  TAPi18n.__("References"), slug: 'references' },
            { name:  TAPi18n.__("Cited By"), slug: 'cited by' },
            { name:  TAPi18n.__("Data & Media"), slug: 'data media' },
            { name:  TAPi18n.__("Metrics"), slug: 'metrics' },
            { name:  TAPi18n.__("Related"), slug: 'related' }
        ];
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});