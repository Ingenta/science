Template.searchHistoryFolderList.helpers({
    historyFolder : function(){
        return Meteor.user().history.saved;
    }
});

Template.searchHistoryFolderList.events({
    'click .fa-trash': function (e) {
        e.folderName = this.folderName;
        confirmDelete(e,function(){
            var tempArray = Meteor.user().history.saved;
            var resultArray = _.filter(tempArray, function (element) {
                return element.folderName !== e.folderName
            });
            Users.update({_id: Meteor.userId()}, {$set: {'history.saved': resultArray}});
        })
    }
});

AutoForm.addHooks(['searchHistoryModalForm'], {
    onSuccess: function () {
        $("#addFolderModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
})

