Meteor.publish('homepageMostRecentArticles', function () {
    return [
        Articles.find({}, {
            sort: {createdAt: -1},
            limit: 10,
            fields: {title: 1, doi: 1, createdAt:1}
        })
    ]
});

Meteor.publish('journalMostRecentArticles', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    var query = journalId && {journalId: journalId} || {};
    return [
        Articles.find(query, {
            sort: {createdAt: -1},
            limit: 10,
            fields: {title: 1, doi: 1, createdAt:1}
        })
    ]
});

Meteor.publish('miniplatformMostRecentArticles', function () {
    var limit = 6;
    var query = {};
    query.publisher = Publishers.findOne({shortname: Config.defaultPublisherShortName})._id;
    return [
        Articles.find(query, {
            sort: {createdAt: -1},
            limit: limit,
            fields: minimumArticle
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1}
        })
    ]
});
Meteor.publish('fullMostRecentArticles', function () {
    return [
        Articles.find({}, {
            sort: {createdAt: -1},
            limit: 10,
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        })
    ]
});
