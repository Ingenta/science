Meteor.publish('homepageNews', function () {
    return News.find({publications: {$exists: false}},{limit:3});
});

Meteor.publish('journalNews', function (journalId) {
    if (!journalId)return this.ready();
    return [
        News.find({publications: journalId}),
        Meeting.find({publications: journalId})
    ]
});

Meteor.publish('fullNewsPage', function (newsId) {
    check(newsId, String);
    return News.find({_id: newsId});
});