Meteor.publish('journal_ad', function() {
    return JournalAC.find();
});