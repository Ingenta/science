Template.authorCentered.helpers({
    hasJournal: function(){
        var publisher = Publishers.findOne({agree:true});
        if(publisher)return Publications.find({publisher:publisher._id});
    },
    getJournalUrl:function(){
        var publisher = Publishers.findOne({_id:this.publisher});
        Session.set("activeTab", "Author Center");
        if(publisher)return "/publisher/" +publisher.name+ "/journal/" + this.shortTitle;
    }
});