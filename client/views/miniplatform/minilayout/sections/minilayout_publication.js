Template.layoutPublications.helpers({
    hasJournal: function(){
        var publisher = Publishers.findOne({agree:true});
        if(publisher)return Publications.find({publisher:publisher._id});
    },
    getJournalUrl:function(){
        return "/miniplatform/" + "authorCentered/" + this.title
    }
});


