Meteor.publish('issues', function() {
    return Issues.find();
});
Meteor.publish('oneJournalIssues', function(journalId) {
    return Issues.find({journalId:journalId});
});