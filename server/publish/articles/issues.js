Meteor.publish('oneJournalIssues', function(journalId) {
    if(!journalId)return this.ready();
    check(journalId, String);
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});
    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return Issues.find({journalId:{$in:idArr}});
});

Meteor.publish('journalIssues', function(journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!journalId)return this.ready();
    var idArr = [journalId];
    var journal=Publications.findOne({_id:journalId},{fields:{historicalJournals:1}});
    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    return Issues.find({journalId:{$in:idArr}});
});