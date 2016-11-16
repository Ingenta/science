Template.JournalWatch.helpers({
    watch: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.journalsOfInterest;
    },
    journalWatch: function () {
        return Publications.findOne({_id: this.toString()});
    },
    count: function () {
        if (Users.findOne().profile)
            if (Users.findOne().profile.journalsOfInterest)
                return Users.findOne().profile.journalsOfInterest.length;
    },
    journalWatchCount: function(){
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.journalsOfInterest.length > 0;
    }
})
Template.JournalWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedJournal']:checked"), 'value');
        var diff = _.difference(Meteor.user().profile.journalsOfInterest, selected);
        Users.update({_id: Meteor.userId()}, {$set: {"profile.journalsOfInterest": diff}});
    }
})