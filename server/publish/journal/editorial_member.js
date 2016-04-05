Meteor.publish('journalAboutTab', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return [
        EditorialMember.find({publications: journalId}),
        AboutArticles.find({publications: journalId})
    ]
});
Meteor.startup(function () {
    EditorialMember._ensureIndex({publications: 1});
});
Meteor.startup(function () {
    AboutArticles._ensureIndex({publications: 1});
});