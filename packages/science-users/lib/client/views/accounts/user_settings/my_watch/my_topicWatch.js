Template.TopicWatch.helpers({
    watch : function(){
        var user = Users.findOne({_id: Meteor.userId()});
        return user.profile.interestedOfTopics;
    },
    topicWatch: function(){
        return Topics.findOne({_id: this.toString()});
    },
    count : function () {
        if(Users.findOne().profile)
        if(Users.findOne().profile.interestedOfTopics)
        return Users.findOne().profile.interestedOfTopics.length;
    }
})
Template.TopicWatch.events({
    'click .btn': function () {
        var selected =  _.pluck($("input[name='selectedTopic']:checked"),'value');
        var diff = _.difference(Meteor.user().profile.interestedOfTopics,selected);
        Users.update({_id:Meteor.userId()},{$set:{"profile.interestedOfTopics": diff}});
    }
})