Template.searchHistoryFolderList.helpers({
    historyFolder : function(){
        return SearchHistory.find();
    }
})

Template.searchHistoryFolderList.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            SearchHistory.remove({_id:id});
        })
    }
});

Template.addFolderModalForm.events({
    'click .btn-primary': function () {

    }
})

AutoForm.addHooks(['addSearchHistoryModalForm'], {
    onSuccess: function () {
        $("#addSearchHistoryModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);

