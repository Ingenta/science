Meteor.publish('editorial_member', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return EditorialMember.find({publications: journalId});
});
