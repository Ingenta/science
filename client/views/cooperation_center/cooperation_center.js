Template.cooperationCenter.helpers({
    publishers: function(){
        return Publishers.find({shortname : Config.defaultPublisherShortName});
    },
    journalAC: function(pId){
        return JournalAC.find({types: "1",publisher: pId});
    },
    adUrl: function () {
        return "/cooperationCenter/" + this._id;
    }
});

Template.cooperationCenter.events({
    'click #adAdd': function (event) {
        var pubsId = $(event.target).data().pubsid;
        Session.set('PublisherId', pubsId);
    },
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            JournalAC.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addAdCenterModalForm'], {
    onSuccess: function () {
        $("#addAdCenterModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            doc.publisher = Session.get('PublisherId');
            return doc;
        }
    }
}, true);