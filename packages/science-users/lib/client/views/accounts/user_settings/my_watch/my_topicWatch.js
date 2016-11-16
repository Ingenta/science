Template.TopicWatch.helpers({
    watch: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.topicsOfInterest;
    },
    topicWatch: function () {
        return Topics.findOne({_id: this.toString()});
    },
    count: function () {
        if (Users.findOne().profile)
            if (Users.findOne().profile.topicsOfInterest)
                return Users.findOne().profile.topicsOfInterest.length;
    },
    topicWatchCount: function(){
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.topicsOfInterest.length > 0;
    }
})
Template.TopicWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedTopic']:checked"), 'value');
        var diff = _.difference(Meteor.user().profile.topicsOfInterest, selected);
        Users.update({_id: Meteor.userId()}, {$set: {"profile.topicsOfInterest": diff}});
    }
})