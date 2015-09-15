Template.JournalWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.profile.interestedOfJournals;
    }
})

Template.SingleJournalWatch.helpers({
    JournalUrl: function(Jourid){

        var publication = Publications.findOne({_id: Jourid});
        var publisher = Publishers.findOne({_id: publication.publisher});
        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title;
        return urls;
    },
    journalWatch: function(){
       return Publications.findOne({_id: this.toString()});
    }
})