Meteor.publish('articles', function () {
    return Articles.find();
});
Meteor.publish('articlesWithoutFulltext', function () {
    return Articles.find({}, {
        fields: {sections: 0}
    })
});

Meteor.publish('oneArticle', function (id) {
    return Articles.find({_id: id});
});

Meteor.publish('mostRecentArticles', function () {
    return [
        Articles.find({}, {
            sort: {createdAt: -1},
            limit: 10,
            fields: {abstract: 0, authors: 0, sections: 0, figures: 0, references: 0}
        }),
        Publishers.find(),
        Publications.find()
    ]
});

Meteor.publish('articleUrls', function () {
    return [
        Articles.find({}, {
            fields: {title: 1, journalId: 1, doi: 1, issueId: 1}
        }),
        Publishers.find(),
        Publications.find()
    ]
});