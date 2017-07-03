Template.aboutTopics.events({
    'click .activeButton': function (event) {
        var aboutValue = $(event.target).data().aboutid;
        Session.set('tabAbout', aboutValue);
    }
});

Template.aboutArticlesList.onRendered(function () {
    if (Session.get('tabAbout')===undefined) {
        Session.set('tabAbout', "a");
    }
});

Template.aboutArticlesList.helpers({
    aboutArticle: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        return AboutArticles.find({about: aboutId,publications:publicationId});
    }
});

Template.aboutArticlesList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            AboutArticles.remove({_id:id});
        })
    }
});

Template.editorialMemberList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            EditorialMember.remove({_id:id});
        })
    }
});

Template.editorialMemberList.helpers({
    members: function () {
        var aboutId = Session.get('tabAbout');
        var publicationId = Session.get('currentJournalId');
        return EditorialMember.find({about: aboutId,publications:publicationId});
    },
    publications: function () {
        var publicationId = Session.get('currentJournalId');
        return Publications.find({_id:publicationId});
    }
});

AutoForm.addHooks(['addAboutArticlesModal'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

AutoForm.addHooks(['addEditorialMemberModal'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe('journalAboutImage', Router.current().params.journalShortTitle)
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabAbout');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);