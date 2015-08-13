Template.AboutTitle.helpers({
    about: function () {
        var publicationsId = Session.get('currentJournalId');
        return About.find({publications: publicationsId});
    },
    isActive: function (id) {
        var aboutId = Session.get('tabAbout');
        if (aboutId === id)return "active";
    }
});

Template.AboutTitle.events({
    'click .activeButton': function (event) {
        var aboutValue = $(event.target).data().aboutid;
        Session.set('tabAbout', aboutValue);
    }
});

Template.EditorialBoardList.onRendered(function () {
    if (!Session.get('tabAbout')) {
        var a = About.findOne();
        if (a)Session.set('tabAbout', a._id);
    }
});

Template.EditorialBoardList.helpers({
    about: function () {
        var aboutId = Session.get('tabAbout');
        return About.find({_id: aboutId});
    },
    aboutarticle: function () {
        var aboutId = Session.get('tabAbout');
        return AboutArticles.find({about: aboutId});
    }
});

AutoForm.addHooks(['addModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            return doc;
        }
    }
}, true);
AutoForm.addHooks(['addAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);