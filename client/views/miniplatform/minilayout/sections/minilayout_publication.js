Template.layoutPublications.helpers({
    hasJournal: function(){
        return Publications.find({"publisher": "hSsscs85HXuu2qTfJ"});
    },
    getJournalUrl:function(){
        return "/miniplatform/" + "authorCentered/" + this.title
    }
});