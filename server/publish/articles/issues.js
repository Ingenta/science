Meteor.publish('journalIssuesIncludingHistorical', function(journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle},{fields:{historicalJournals:1}});
    if(!journal)return this.ready();
    var journalId=journal._id;
    if(!journalId)return this.ready();
    if(!Permissions.userCan("modify-journal","resource",this.userId,{journalId:journalId}))
        return this.ready();
    var idArr = [];
    if(journal && !_.isEmpty(journal.historicalJournals)){
        idArr = _.union(idArr,journal.historicalJournals)
    }
    if(_.isEmpty(idArr))
        return this.ready();
    return Issues.find({journalId:{$in:idArr}});
});
Meteor.startup(function () {
    Issues._ensureIndex({journalId: 1});
});
