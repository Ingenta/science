Template.AboutTitle.events({
    'click .activeButton': function (event) {
        var aboutValue = $(event.target).data().aboutid;
        Session.set('tabAbout', aboutValue);
    }
});

Template.aboutArticlesList.helpers({
    aboutArticle: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        return AboutArticles.find({about: aboutId},{publications:publicationId});
    }
});

Template.editorialMemberList.helpers({
    members: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        return EditorialMember.find({about: aboutId},{publications:publicationId});
    },
    contactId: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        var contents =  AboutArticles.find({about: aboutId},{publications:publicationId});
        if(contents===undefined){
            return false;
        }
        return true;
    },
    aboutArticles: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        return AboutArticles.find({about: aboutId},{publications:publicationId});
    }
});

AutoForm.addHooks(['addAboutArticlesModal'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            doc.publications = Session.get('currentJournalId');
            debugger
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addEditorialMemberModal'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);