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
Template.journalOptions.helpers({
    tabs: function () {
        var tabList = [
            { name: TAPi18n.__("Browse"), slug: 'browse' }
        ];
//            { name: TAPi18n.__("Overview"), slug: 'overview' },
//            { name: TAPi18n.__("Browse"), slug: 'browse' },
//            { name: TAPi18n.__("About"), slug: 'about' }
        var currentTitle = Router.current().params.journalTitle;
        var journalTabSelections = Publications.findOne({title: currentTitle}).tabSelections;
        _.each(journalTabSelections, function (t) {
            tabList.push({ name: TAPi18n.__(t), slug: t });
        });
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
