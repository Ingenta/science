Template.TopicWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.profile.interestedOfTopics;
    }
})

Template.SingleTopicWatch.helpers({
    topicWatch: function(){
        return Topics.findOne({_id: this.toString()});
    }
})