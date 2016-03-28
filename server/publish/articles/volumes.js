Meteor.publish('oneJournalVolumes', function(journalId) {
    if(!journalId)return this.ready();
    check(journalId, String);
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});
    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return Volumes.find({journalId:{$in:idArr}});
});
