Template.authorCentered.helpers({
    hasJournal: function(){
        return Publications.find({"publisher": Config.mainPublish});
    },
    getJournalUrl:function(){
        return "/miniplatform/" + "authorCentered/" + this.title
    }
});