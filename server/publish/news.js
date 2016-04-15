Meteor.publish('homepageNews', function () {
    return News.find({publications: {$exists: false}},{fields: {content: 0}});
});

Meteor.publish('journalNews', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;

    return [
        News.find({publications: journalId}, {fields: {content: 0}}),
        Meeting.find({publications: journalId})
    ]
});

Meteor.publish('fullNewsPage', function (newsId) {
    check(newsId, String);
    return News.find({_id: newsId});
});