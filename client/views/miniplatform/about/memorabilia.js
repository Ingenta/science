Template.memorabiliaList.helpers({
    memorabilias: function () {
        var type = "4";
        return NewsContact.find({types:type});
    }
});

Template.memorabiliaList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addMemorabiliaModalForm'], {
    onSuccess: function () {
        $("#addMemorabiliaModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "4";
            return doc;
        }
    }
}, true);