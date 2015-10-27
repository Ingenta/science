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
    },
    form : function(){
        var form = (_.contains(["bar","history"],this.from))?TAPi18n.__("Common Search"):"";
        return form;
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
    },
    'click .folder' : function(e){
        e.stopPropagation();
        var keyword=$(e.target).closest("ul").data().keyword;
        var tempArray = Meteor.user().history.unsave;
        var resultArray = _.filter(tempArray, function (element) {
            return element.word !== keyword
        });
        var folderName=this.folderName;
        var savedObjs = _.map(Meteor.user().history.saved,function(item){
            if( item.folderName===folderName){
                if(!item.words){
                    item.words=[];
                }
                item.words.push({word:keyword,createOn:new Date()});
            }
            return item;
        });

        Users.update({_id: Meteor.userId()}, {$set: {"history.unsave":resultArray,"history.saved":savedObjs}});
    }
})
