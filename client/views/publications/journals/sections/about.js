
AutoForm.addHooks(['addAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
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
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
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
