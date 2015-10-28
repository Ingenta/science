Template.council.helpers({
    hide: function () {
        return NewsContact.find({types:"3"}).count()<1 ? "": "hide";
    }
});

Template.councilList.helpers({
    councils: function () {
        var type = "3";
        return NewsContact.find({types:type});
    }
});

Template.councilList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addCouncilModalForm'], {
    onSuccess: function () {
        $("#addCouncilModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "3";
            return doc;
        }
    }
}, true);