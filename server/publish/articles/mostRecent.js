Meteor.publish('homepageMostRecentArticles', function (publisherId,count) {
    check(publisherId, String);
    check(count, Number);
    var c=count || 10;
    var query = {};
    if(publisherId)
        query.publisher=publisherId;
    return [
        Articles.find(query, {
            sort: {createdAt: -1},
            limit: c,
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
