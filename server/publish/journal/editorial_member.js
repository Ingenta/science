Meteor.publish('journalAboutTab', function (journalId) {
    if (!journalId)return this.ready();
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