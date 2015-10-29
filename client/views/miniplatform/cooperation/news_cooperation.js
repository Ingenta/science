Template.cooperationList.helpers({
    cooperationLists: function () {
        return NewsLink.find({types:"2"});
    }
});

Template.cooperationList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsLink.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addNewsLinkModalForm'], {
    onSuccess: function () {
        $("#addNewsLinkModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "2";
            return doc;
        }
    }
}, true);