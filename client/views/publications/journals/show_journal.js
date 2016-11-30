Template.journalTabs.onCreated(function () {
    this.waiting = ReactiveVar(0);
})
ReactiveTabs.createInterface({
    template: 'journalTabs',
    onChange: function (slug, template) {
        var url = Session.get('baseJournalUrl');
        if(slug=='Browse' && Session.get("currentIssueId")){
            var cissue=Issues.findOne({_id:Session.get("currentIssueId")});
            url+="/"+cissue.volume+"/"+cissue.issue;
        }
        url+="?slug="+slug;
        history.replaceState({},document.title,url);
        //Session.set("activeTab", "")
        //when on table of contents page and another tab is clicked switch to basic route
        if (Router.current().params.journalShortTitle) {
            var journal = Publications.findOne({shortTitle: Router.current().params.journalShortTitle});
            if (slug === 'Overview') {
                //Meteor.subscribe("insertMostReadArticles");//只为本地和测试环境提供热读文章信息，不需要开启
                Meteor.call("insertAudit", Meteor.userId(), "journalOverview", journal.publisher, journal._id, function (err, response) {
                    if (err) console.log(err);
                });
            } else if (slug === 'Browse') {
                Meteor.subscribe('journalBrowseTabArticleList', Session.get("currentIssueId"));
                //var articlesSub = Meteor.subscribe('journalBrowseTabArticleList', Session.get("currentIssueId"));
                //template.waiting.set(!articlesSub.ready());
                if (Permissions.isAdmin()){
                }else{
                    if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
                        Meteor.call("getLocationByCurrentIP", function (err, result) {
                            if (!result)console.log("ip not found.");
                            else {
                                //console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                                Session.set("ipInChina", result.country_code === "CN");
                            }
                        })
                    }
                }
                Meteor.call("insertAudit", Meteor.userId(), "journalBrowse", journal.publisher, journal._id, function (err, response) {
                    if (err) console.log(err);
                });
            } else if (slug === 'Accepted') {
                Meteor.subscribe("journalAcceptedTab", journal._id);
                if (Permissions.isAdmin()){
                }else{
                    if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
                        Meteor.call("getLocationByCurrentIP", function (err, result) {
                            if (!result)console.log("ip not found.");
                            else {
                                //console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                                Session.set("ipInChina", result.country_code === "CN");
                            }
                        })
                    }
                }
            } else if (slug === 'Online First') {
                Meteor.subscribe("journalOnlineFirstTab", journal._id);
                if (Permissions.isAdmin()){
                }else{
                    if (!Session.get("ipInChina")) { //TODO: can be removed after february when the rules about springerlink licensing change
                        Meteor.call("getLocationByCurrentIP", function (err, result) {
                            if (!result)console.log("ip not found.");
                            else {
                                //console.log("Your location has been detected as: " + JSON.stringify(result));//result.country_name ? result.country_name : result);//"No country found!");
                                Session.set("ipInChina", result.country_code === "CN");
                            }
                        })
                    }
                }
            } else if (slug === 'Author Center') {
                Meteor.subscribe("journalAuthorCenterTab", journal._id);
            } else if (slug === 'Special Topics') {
                Meteor.subscribe('journalSpecialTopics', Router.current().params.journalShortTitle);
                Meteor.subscribe("journalIssuesIncludingHistorical", Router.current().params.journalShortTitle);
            } else if (slug === 'Editorial Board') {
                Meteor.subscribe("journalEditorialBoard", journal._id);
            } else if (slug === 'About') {
                Meteor.subscribe("journalAboutTab", journal._id);
            } else if (slug === 'Media') {
                Meteor.subscribe('journalMediasInfo', journal._id);
            } else if (slug === 'MOOP') {
                Meteor.subscribe('journalMediasInfo', journal._id);
                Meteor.subscribe("journalMoopTab", journal._id);
                Meteor.subscribe('journalBrowseTabVolumeList', Router.current().params.journalShortTitle);
                Meteor.subscribe('journalMoopTabArticleList', journal._id);
            } else if (slug === 'News') {
                Meteor.subscribe('journalNews', journal._id)
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
        return banner.url({auth: false});
    },
    hasJournalBanner: function (journalId) {
        if (!journalId)return;
        var journal = Publications.findOne({_id: journalId});
        if (!journal) return;
        if (!journal.banner) return;
        return true;
    }
});

Template.ShowJournal.onCreated(function(){
    var journalId=this._id;
    var publisher=this.publisher;
    if (!journalId || !publisher) return;
    Session.set('currentJournalId', journalId);
    Session.set('currentPublisherId', publisher);
    if (Router.current().params.journalShortTitle) {
        if (!Router.current().params.hash) {
            Meteor.call("getLatestIssueId", journalId, function (err, response) {
                if (err) return console.log(err);
                response && Session.set("currentIssueId", response);
                // window.location.hash = response;
            });
            console.log("getting latest issue")
        }
    }
});

Template.journalOptions.helpers({
    tabs: function () {
        var tabList = [];
        var currentTitle = Router.current().params.journalShortTitle;
        if (!currentTitle)return;
        var journal = Publications.findOne({shortTitle: currentTitle});
        if (!journal)return;
        var journalTabSelections = journal.tabSelections;
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

