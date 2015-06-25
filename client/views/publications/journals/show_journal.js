ReactiveTabs.createInterface({
    template: 'journalTabs'
});
Template.journalBanner.helpers({
    getBannerImage: function (pictureId) {
        if (pictureId !== undefined)
            return Images.findOne({_id: pictureId}).url();
    }
});
Template.journalOptions.helpers({
    context: function () {
        var currentTitle = Router.current().params.journalTitle;
        return Publications.findOne({title: currentTitle});
    }
});
Template.ShowJournal.helpers({
    initPage:function(id,publisher){
        Session.set('currentJournalId',id);
        Session.set('currPublisher',publisher);
    }
});
Template.journalOptions.helpers({
    tabs: function () {
        var tabList = [];
        var currentTitle = Router.current().params.journalTitle;
        var journalTabSelections = Publications.findOne({title: currentTitle}).tabSelections;
        _.each(journalTabSelections, function (t) {
            if(t==="Overview"){
                tabList.push({ name: TAPi18n.__("Overview"), slug: 'Overview' });
                tabList.push({ name: TAPi18n.__("Browse"), slug: 'Browse' });
            } else if(tabList.length==0){
                tabList.push({ name: TAPi18n.__("Browse"), slug: 'Browse' });
                tabList.push({ name: TAPi18n.__("About"), slug: 'About' });
            } else{
                tabList.push({ name: TAPi18n.__("About"), slug: 'About' });
            }
        });
        if(tabList.length==0){
            tabList.push({ name: TAPi18n.__("Browse"), slug: 'Browse' });
        }

        return tabList;
    },
    activeTab: function () {
        return Session.get('activeTab');
    }
});

AutoForm.addHooks(['addAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before: {
        insert: function (doc) {
            doc.publications = Session.get('currPublication');
            return doc;
        }
    }
}, true);

Template.AboutTitle.helpers({
    about: function () {
        var publicationsId = Session.get('currPublication');
        return About.find({publications: publicationsId});
    }
});

Template.AboutTitle.events({
    'click .activeButton': function (event) {
        var aboutValue = $(event.target).data().aboutid;
        Session.set('tabAbout', aboutValue);
    }
});

AutoForm.addHooks(['addAboutArticlesModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            return doc;
        }
    }
}, true);

Template.aboutArticlesList.helpers({
    about: function () {
        var aboutId = Session.get('tabAbout');
        return About.find({_id: aboutId});
    },
    aboutarticle: function () {
        var aboutId = Session.get('tabAbout');
        return AboutArticles.find({about: aboutId});
    }
});

Template.latestArticles.helpers({
    lateArticles: function () {
        return Articles.find({}, {sort: {createdAt: -1}, limit: 3});
    },
    urlToArticle: function (title) {
        var article = Articles.findOne({title: title});
        var publisherName = Publishers.findOne({_id: article.publisher}).name;
        var journalName = Publications.findOne({_id: article.journalId}).title;
        return "/publisher/" + publisherName + "/journal/" + journalName + "/article/" + title;
    },
});