Template.JournalWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
//        var i;
//        for(i=0;i<=user.profile.interestedOfJournals.length;i++){
//            return Publications.find({"_id": user.profile.interestedOfJournals[i]});
//        }
//            user.profile.interestedOfJournals.forEach(function () {

//            var id = Keywords.findOne({"name": k})._id;
//            Keywords.update({_id: id}, {$inc: {"score": 2}})
//        })
        console.log(user.profile.interestedOfJournals);
        return user.profile.interestedOfJournals;
    }
})

Template.SingleJournalWatch.helpers({
//    JournalUrl: function(Jourid){

//        var publication = Publications.findOne({_id: Jourid});
//        var publisher = Publishers.findOne({_id: publication.publisher});
//        var urls = "/publisher/"+publisher.name+"/journal/"+publication.title;
//        return urls;
//    }
    eachJournal: function(Jourid){
        console.log(Jourid);
       return Publications.findOne({_id: Jourid});
    }
})