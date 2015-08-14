Template.aboutTitle.helpers({
    abouts: function () {
        var publicationsId = Session.get('currentJournalId');
        return About.find({publications: publicationsId});
    },
    isActive: function (id) {
        var aboutId = Session.get('tabBoard');
        if (aboutId === id)return "active";
    }
});

Template.aboutTitle.events({
    'click .activeButton': function (event) {
        var boardValue = $(event.target).data().aboutsid;
        Session.set('tabBoard', boardValue);
    }
});

Template.EditorialBoardList.onRendered(function () {
    if (!Session.get('tabBoard')) {
        var a = About.findOne();
        if (a)Session.set('tabBoard', a._id);
    }
});

Template.EditorialBoardList.helpers({
    about: function () {
        var aboutId = Session.get('tabBoard');
        return About.find({_id: aboutId});
    },
    editorialBoards: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return EditorialBoard.find({about: aboutId},{publications:publicationId});
    },
    WorkUnits: function () {
        if(this.WorkUnitsEn||this.WorkUnitsCn){
            return true;
        }
        return false;
    },
    researchArea: function () {
        if(this.researchAreaEn||this.researchAreaCn){
            return true;
        }
        return false;
    },
    abstract: function () {
        if(this.researchAreaCn||this.abstractCn){
            return true;
        }
        return false;
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

AutoForm.addHooks(['addEditorialBoardModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabBoard');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);