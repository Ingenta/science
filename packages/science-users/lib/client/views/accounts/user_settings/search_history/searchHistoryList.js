Template.searchHistoryList.helpers({
    searchHistory:function(){
        var user = Meteor.user();
        return user.history.unsave;
    },
    time : function(){
        return this.createOn.format("yyyy-MM-dd");
    },
    folder : function(){
        return Meteor.user().history.saved;
    }
})

Template.searchHistoryList.events({
    'click .fa-trash': function (e) {
        e.word = this.word;
        confirmDelete(e,function(){
            var tempArray = Meteor.user().history.unsave;
            var resultArray = _.filter(tempArray, function (element) {
                return element.word !== e.word
            });
            Users.update({_id: Meteor.userId()}, {$set: {'history.unsave': resultArray}});
        })
    }
})
