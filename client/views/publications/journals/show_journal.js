ReactiveTabs.createInterface({
    template: 'journalTabs'
});
Template.journalBanner.helpers({
    getJournalBannerById: function (journalId) {
        if (journalId===undefined)return;
        var journal = Publications.findOne({_id: journalId});
        if (journal===undefined) return;
        if (journal.banner===undefined) return;
        return Images.findOne({_id: journal.banner}).url();
    }
});
Template.journalOptions.helpers({
    context: function () {
        var currentTitle = Router.current().params.journalTitle;
        return Publications.findOne({title: currentTitle});
    }
});
Template.ShowJournal.helpers({
    initPage: function (id, publisher) {
        Session.set('currentJournalId', id);
        Session.set('currPublisher', publisher);
    }
});
Template.journalOptions.helpers({
    tabs: function () {
        var tabList = [];
        var currentTitle = Router.current().params.journalTitle;
        if (!currentTitle)return;
        var journalTabSelections = Publications.findOne({title: currentTitle}).tabSelections;
        _.each(journalTabSelections, function (t) {
            if (t === "Overview") {
                tabList.push({name: TAPi18n.__("Overview"), slug: 'Overview'});
                tabList.push({name: TAPi18n.__("Browse"), slug: 'Browse'});
            } else if (tabList.length == 0) {
                tabList.push({name: TAPi18n.__("Browse"), slug: 'Browse'});
                tabList.push({name: TAPi18n.__("About"), slug: 'About'});
            } else {
                tabList.push({name: TAPi18n.__("About"), slug: 'About'});
            }
        });
        if (tabList.length == 0) {
            tabList.push({name: TAPi18n.__("Browse"), slug: 'Browse'});
        }

        return tabList;
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});

