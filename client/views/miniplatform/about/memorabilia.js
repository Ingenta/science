Template.memorabilia.helpers({
    hide: function () {
        return NewsContact.find({types:"4"}).count()<1 ? "": "hide";
    }
});

Template.memorabiliaList.helpers({
    memorabilias: function () {
        return NewsContact.find({types:"4"});
    }
});

Template.memorabiliaList.events({
    'click #memDel': function (e) {
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
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);