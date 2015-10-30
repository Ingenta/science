Template.magazineProfile.helpers({
    hide: function () {
        return NewsContact.find({types:"2"}).count()<1 ? "": "hide";
    }
});

Template.magazineProfileList.helpers({
    profiles: function () {
        return NewsContact.find({types:"2"});
    }
});

Template.magazineProfileList.events({
    'click #proDel': function (e) {
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
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);