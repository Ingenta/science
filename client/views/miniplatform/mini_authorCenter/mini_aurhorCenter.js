Template.authorCentered.helpers({
    hasJournal: function(){
        return Publications.find({"publisher": Config.mainPublish});
    },
    getJournalUrl:function(){
        var publisher = Publishers.findOne({_id: Config.mainPublish});
        if(publisher)return "/publisher/" +publisher.name+ "/journal/" + this.title
        return;
    }
});