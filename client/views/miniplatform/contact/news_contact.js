Template.contactList.helpers({
    contactUs: function () {
        var type = "1";
        return NewsContact.find({types:type});
    }
});

Template.contactList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addNewsContactModalForm'], {
    onSuccess: function () {
        $("#addNewsContactModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "1";
            return doc;
        }
    }
}, true);