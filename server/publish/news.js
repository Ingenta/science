Meteor.publish('homepageNews', function () {
    return News.find({publications: {$exists: false}},{limit:3});
});

Meteor.publish('journalNews', function (journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    return [
        News.find({publications: journalId}),
        Meeting.find({publications: journalId})
    ]
});

Meteor.publish('fullNewsPage', function (newsId) {
    check(newsId, String);
    return News.find({_id: newsId});
});