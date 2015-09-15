Template.aboutTitle.helpers({
    abouts: function () {
        var publicationsId = Session.get('currentJournalId');
        return About.find({publications: publicationsId});
    },
    isActive: function (id) {
        var aboutId = Session.get('tabBoard');
        if (aboutId === id)return "active";
    },
    boardMember: function () {
        var aboutId = Session.get('tabBoard');
        if(aboutId===undefined){
            return false;
        }
        return About.findOne({_id: aboutId}).agree;
    }
});

Template.aboutTitle.events({
    'click .activeButton': function (event) {
        var boardValue = $(event.target).data().aboutsid;
        Session.set('tabBoard', boardValue);
    },
    'click .about': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            About.remove({_id:id});
        })
    }
});

Template.EditorialBoardList.onRendered(function () {
    var publicationsId = Session.get('currentJournalId');
    var a = About.findOne({publications: publicationsId});
    if (a)Session.set('tabBoard', a._id);
});

Template.EditorialBoardList.helpers({
    about: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return About.find({_id: aboutId,publications:publicationId});
    },
    editorialBoards: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return EditorialBoard.find({about: aboutId,publications:publicationId});
    },
    WorkUnits: function () {
        if(this.workUnits.en||this.workUnits.cn){
            return true;
        }
        return false;
    },
    Phone: function () {
        if(this.phone){
            return true;
        }
        return false;
    },
    Fax: function () {
        if(this.fax){
            return true;
        }
        return false;
    },
    Email: function () {
        if(this.email){
            return true;
        }
        return false;
    },
    ResearchArea: function () {
        if(this.researchArea.en||this.researchArea.cn){
            return true;
        }
        return false;
    },
    Abstract: function () {
        if(this.abstract.en||this.abstract.cn){
            return true;
        }
        return false;
    }
});

Template.EditorialBoardList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            EditorialBoard.remove({_id:id});
        })
    }
});

Template.EditorialBoardMembersList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            EditorialBoard.remove({_id:id});
        })
    }
});

Template.EditorialBoardMembersList.onRendered(function () {
    if (!Session.get('tabBoard')) {
        var a = About.findOne();
        if (a)Session.set('tabBoard', a._id);
    }
});

Template.EditorialBoardMembersList.helpers({
    about: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return About.find({_id: aboutId,publications:publicationId});
    },
    editorialBoards: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return EditorialBoard.find({about: aboutId,publications:publicationId});
    },
    WorkUnits: function () {
        if(this.workUnits.en||this.workUnits.cn){
            return true;
        }
        return false;
    },
    Phone: function () {
        if(this.phone){
            return true;
        }
        return false;
    },
    Fax: function () {
        if(this.fax){
            return true;
        }
        return false;
    },
    Email: function () {
        if(this.email){
            return true;
        }
        return false;
    },
    ResearchArea: function () {
        if(this.researchArea.en||this.researchArea.cn){
            return true;
        }
        return false;
    },
    Abstract: function () {
        if(this.abstract.en||this.abstract.cn){
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