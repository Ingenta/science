Template.JournalWatch.helpers({
    watch: function () {
        var user = Users.findOne({_id: Meteor.userId()});
        if (user && user.profile)
            return user.profile.interestedOfJournals;
    },
    journalWatch: function () {
        return Publications.findOne({_id: this.toString()});
    },
    count: function () {
        if (Users.findOne().profile)
            if (Users.findOne().profile.interestedOfJournals)
                return Users.findOne().profile.interestedOfJournals.length;
    }
})
Template.JournalWatch.events({
    'click .btn': function () {
        var selected = _.pluck($("input[name='selectedJournal']:checked"), 'value');
        var diff = _.difference(Meteor.user().profile.interestedOfJournals, selected);
        Users.update({_id: Meteor.userId()}, {$set: {"profile.interestedOfJournals": diff}});
    }
})