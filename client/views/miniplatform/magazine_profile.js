Template.magazineProfileList.helpers({
    profiles: function () {
        var type = "2";
        return NewsContact.find({types:type});
    }
});

Template.magazineProfileList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addMagazineProfileModalForm'], {
    onSuccess: function () {
        $("#addMagazineProfileModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "2";
            return doc;
        }
    }
}, true);