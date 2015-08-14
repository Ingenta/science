Template.aboutTitle.helpers({
    about: function () {
        var publicationsId = Session.get('currentJournalId');
        return About.find({publications: publicationsId});
    },
    isActive: function (id) {
        var aboutId = Session.get('tabAbout');
        if (aboutId === id)return "active";
    }
});

Template.aboutTitle.events({
    'click .activeButton': function (event) {
        var aboutValue = $(event.target).data().aboutid;
        Session.set('tabAbout', aboutValue);
    }
});

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