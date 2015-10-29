Template.contactList.helpers({
    contactUs: function () {
        return NewsContact.find({types:"1"});
    }
});

Template.contactList.events({
    'click #contactDel': function (e) {
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
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);