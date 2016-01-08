Template.searchHistoryFolderList.helpers({
    historyFolder : function(){
        return Meteor.user().history.saved;
    }
});

Template.eachWords.helpers({
    searchUrl:function(){
        return SolrQuery.makeUrl({query:this.word,setting:{from:"history"}});
    }
});

Template.searchHistoryFolderList.events({
    'click .remove-folder': function (e) {
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

Template.eachWords.events({
    'click .remove-word':function(e){
        var that = this;
        confirmDelete(e,function(){
            var folderName = $(e.target).closest("li").attr("id");
            var history = Meteor.user().history;
            var index=_.findIndex(history.saved,function(item){
                return item.folderName===folderName;
            });
            history.saved[index].words=_.filter(history.saved[index].words,function(item){
                return item.word!==that.word
            });
            history.unsave = history.unsave || [];
            history.unsave.push(that)
            Users.update({_id: Meteor.userId()}, {$set: {"history":history}});
        })
    }
});

AutoForm.addHooks(['searchHistoryModalForm'], {
    onSuccess: function () {
        $("#addFolderModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
})

