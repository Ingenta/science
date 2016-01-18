Meteor.publish('issues', function() {
    return Issues.find();
});
Meteor.publish('oneJournalIssues', function(journalId) {
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});
    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return Issues.find({journalId:{$in:idArr}});
});