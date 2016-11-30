Template.aboutTitle.helpers({
    abouts: function () {
        var publicationsId = Session.get('currentJournalId');
        if(publicationsId)return About.find({publications: publicationsId});
    },
    isActive: function (id) {
        var aboutId = Session.get('tabBoard');
        var publicationsId = Session.get('currentJournalId');
        if(publicationsId){
            var about = About.findOne({publications: publicationsId});
            if(aboutId){
                if (aboutId === id)return "active";
            }else{
                Session.set('tabBoard', about._id);
            }
        }
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

Template.EditorialBoardMembersList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            EditorialBoard.remove({_id:id});
        })
    }
});

Template.EditorialBoardMembersList.onRendered(function () {
    var publicationsId = Session.get('currentJournalId');
    var a = About.findOne({publications: publicationsId});
    if (a)Session.set('tabBoard', a._id);
});

Template.EditorialBoardMembersList.helpers({
    about: function () {
        var aboutId = Session.get('tabBoard');
        if(aboutId)return About.findOne({_id: aboutId});
    },
    editorialBoards: function () {
        var aboutId = Session.get('tabBoard');
        var publicationId = Session.get('currentJournalId');
        return EditorialBoard.find({about: aboutId,publications:publicationId},{sort: {name: 1}});
    },
    canDoThis:function(){
        return Permissions.userCan("modify-journal", "resource", Meteor.userId(), {journal:Session.get('currentJournalId')});
    }
});

AutoForm.addHooks(['addAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
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
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.about = Session.get('tabBoard');
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);