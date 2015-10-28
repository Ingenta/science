Template.layoutPicture.helpers({
    myAds: function () {
        return NewsLink.find({types:"3"});
    },
    hide: function () {
        return NewsLink.find({types:"3"}).count()<2 ? "": "hide";
    }
});

Template.layoutPicture.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsLink.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addPictureModalForm'], {
    onSuccess: function () {
        $("#addPictureModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "3";
            return doc;
        }
    }
}, true);