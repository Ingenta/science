Meteor.publish('journalSpecialTopics', function(journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return SpecialTopics.find({journalId:journalId})
});