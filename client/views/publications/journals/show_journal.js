ReactiveTabs.createInterface({
    template: 'journalTabs',
    onChange: function (slug) {
        Session.set("activeTab", "")
        //when on table of contents page and another tab is clicked switch to basic route
        if (slug !== "Browse" && Router.current().route.getName() === "journal.name.toc") {
            Router.current().params.volume = undefined;
            Router.current().params.issue = undefined;
            Router.go("journal.name", Router.current().params)
        }
        var journal = Publications.findOne({shortTitle: Router.current().params.journalShortTitle});
        if (slug === 'Overview') {
            Meteor.call("insertAudit", Meteor.userId(), "journalBrowse", journal.publisher, journal._id, function (err, response) {
                if (err) console.log(err);
            });
        } else if (slug === 'Browse') {
            Meteor.call("insertAudit", Meteor.userId(), "journalBrowse", journal.publisher, journal._id, function (err, response) {
                if (err) console.log(err);
            });
        }
    }
});

Template.journalBanner.helpers({
    getJournalBannerById: function (journalId) {
        if (!journalId)return;
        var journal = Publications.findOne({_id: journalId});
        if (!journal) return;
        if (!journal.banner) return;
        return Images.findOne({_id: journal.banner}).url();
    },
    hasJournalBanner: function (journalId) {
        if (!journalId)return;
        var journal = Publications.findOne({_id: journalId});
        if (!journal) return;
        if (!journal.banner) return;
        return true;
    }
});

Template.ShowJournal.helpers({
    initPage: function (id, publisher) {
        Session.set('currentJournalId', id);
        Session.set('currentPublisherId', publisher);
    }
});

Template.journalOptions.helpers({
    tabs: function () {
        var tabList = [];
        var currentTitle = Router.current().params.journalShortTitle;
        if (!currentTitle)return;
        var journalTabSelections = Publications.findOne({shortTitle: currentTitle}).tabSelections;
        _.each(journalTabSelections, function (t) {
            tabList.push({name: TAPi18n.__(t), slug: t});
        });
        if (tabList.length == 0) {
            tabList.push({name: TAPi18n.__("Browse"), slug: 'Browse'});
        }
        return tabList;
    },
    activeTab: function () {
        return Session.get('activeTab');
    },
    journalContext: function () {
        var currentTitle = Router.current().params.journalShortTitle;
        return Publications.findOne({shortTitle: currentTitle});
    }
});

