Meteor.publish('homepageMostRecentArticles', function () {
    return [
        Articles.find({}, {
            sort: {createdAt: -1},
            limit: 10,
            fields: minimumArticle
        }),
        Publishers.find({}, {
            fields: {name: 1}
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
            fields: {name: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        })
    ]
});
