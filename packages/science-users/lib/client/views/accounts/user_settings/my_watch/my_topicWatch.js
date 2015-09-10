Template.TopicWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        var i;
        for(i=0;i<=user.profile.interestedOfTopics.length;i++){
            return Topics.find({"_id": user.profile.interestedOfTopics[i]});
        }
    }
})