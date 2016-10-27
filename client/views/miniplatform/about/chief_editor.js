Template.chiefEditor.helpers({
    hide: function () {
        return NewsContact.find({types:"9"}).count()<1 ? "": "hide";
    }
});

Template.chiefEditorList.helpers({
    chiefEditor: function () {
        return NewsContact.find({types:"9"});
    }
});

Template.chiefEditorList.events({
    'click #chiefEdi': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            NewsContact.remove({_id:id});
        })
    }
});

AutoForm.addHooks(['addChiefEditorModalForm'], {
    onSuccess: function () {
        $("#addChiefEditorModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.types = "9";
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);