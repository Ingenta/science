Meteor.publish('journalSpecialTopics', function(journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    var s = SpecialTopics.find({journalId:journalId})
    var issues = Issues.find({journalId:journalId});
    return [s,issues]
});