Template.subscriptionList.helpers({
    subscriptions: function () {
        var type = "5";
        return NewsContact.find({types:type});
    }
});

Template.subscriptionList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addSubscriptionModalForm'], {
    onSuccess: function () {
        $("#addSubscriptionModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "5";
            return doc;
        }
    }
}, true);