
ReactiveTabs.createInterface({
    template: 'journalTabs',
    onChange: function (slug) {
        Session.set("WaitingForArticles",true);
        //Session.set("activeTab", "")
        //when on table of contents page and another tab is clicked switch to basic route
        if (Router.current().params.journalShortTitle) {
            var journal = Publications.findOne({shortTitle: Router.current().params.journalShortTitle});
            if (slug === 'Overview') {
                Meteor.call("insertAudit", Meteor.userId(), "journalOverview", journal.publisher, journal._id, function (err, response) {
                    if (err) console.log(err);
                });
            } else if (slug === 'Browse') {
                Meteor.subscribe('journalBrowseTabVolumeList', Router.current().params.journalShortTitle);
                var articlesSub = Meteor.subscribe('journalBrowseTabArticleList', Router.current().params.journalShortTitle, Session.get("currentIssueId"));
                Session.set("WaitingForArticles",!articlesSub.ready())
                Meteor.call("insertAudit", Meteor.userId(), "journalBrowse", journal.publisher, journal._id, function (err, response) {
                    if (err) console.log(err);
                });
                Session.set("activeTab",""); //NOTE: possibly need this to prevent page sticking to browse or could disable tabs
            } else if(slug === 'Editorial Board'){
                Meteor.subscribe("journalEditorialBoard",Router.current().params.journalShortTitle);
            } else if(slug === 'Accepted'){
                Meteor.subscribe("journalAcceptedTab",Router.current().params.journalShortTitle);
            } else if(slug === 'Online First'){
                Meteor.subscribe("journalOnlineFirstTab",Router.current().params.journalShortTitle);
            }else if(slug === 'Author Center'){
                Meteor.subscribe("journalAuthorCenterTab",Router.current().params.journalShortTitle);
            }else if(slug === 'Special Topics'){
                Meteor.subscribe("journalIssuesIncludingHistorical",Router.current().params.journalShortTitle);
            }else if(slug === 'About'){
                Meteor.subscribe("journalAboutTab",Router.current().params.journalShortTitle);
                Meteor.subscribe("editorial_member",Router.current().params.journalShortTitle);
            }else if(slug === 'MOOP'){
                Meteor.subscribe("journalMoopTab",Router.current().params.journalShortTitle);
                Meteor.subscribe('journalBrowseTabVolumeList', Router.current().params.journalShortTitle);
                Meteor.subscribe('journalBrowseTabArticleList', Router.current().params.journalShortTitle, Session.get('currMoopIssue_'+journal._id));
            }else if (slug === 'News'){
                Meteor.subscribe('journalNews', Router.current().params.journalShortTitle)
            }
        }
    }
});

Template.journalBanner.helpers({
    getJournalBannerById: function (journalId) {
        if (!journalId)return;
        var journal = Publications.findOne({_id: journalId});
        if (!journal) return;
        if (!journal.banner) return;
        var banner = Images.findOne({_id: journal.banner});
        if (!banner) return;
        return banner.url({auth:false});
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
        if (Router.current().params.journalShortTitle) {
            var journal = Publications.findOne({shortTitle: Router.current().params.journalShortTitle});
            if (!Router.current().params.hash) {
                Meteor.call("getLatestIssueId", journal._id, function (err, response) {
                    if (err) console.log(err);
                    response && Session.set("currentIssueId", response);
                    window.location.hash = response;
                });
            }
        }
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

