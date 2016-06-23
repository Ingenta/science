Template.searchHistoryList.helpers({
    searchHistory:function(){
        return Meteor.user()&&Meteor.user().history && Meteor.user().history.unsave.sort(function(a,b){return a.createOn< b.createOn?1:-1});
    },
    time : function(){
        return this.createOn.format("yyyy-MM-dd");
    },
    folder : function(){
        return Meteor.user()&&Meteor.user().history && Meteor.user().history.saved
    },
    form : function(){
        var form = (_.contains(["bar","history"],this.from))?TAPi18n.__("Common Search"):"";
        return form;
    },
    searchUrl:function(){
        return SolrQuery.makeUrl({query:this.word,setting:{from:"history"}});
    },
    hasFolder:function(){
        return Meteor.user()&&Meteor.user().history && Meteor.user().history.saved;
    }
})

Template.searchHistoryList.events({
    'click .remove-unsave': function (e) {
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
        $(e.target).closest("ul").dropdown('toggle');
        var keyword=$(e.target).closest("ul").data().keyword;
        var from=$(e.target).closest("ul").data().from;
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
                item.words.push({word:keyword,createOn:new Date(),from:from});
            }
            return item;
        });

        Users.update({_id: Meteor.userId()}, {$set: {"history.unsave":resultArray,"history.saved":savedObjs}});
    }
})
