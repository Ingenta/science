Meteor.publish('volumes', function() {
    return Volumes.find();
});
Meteor.publish('oneJournalVolumes', function(journalId) {
    return Volumes.find({journalId:journalId});
});
