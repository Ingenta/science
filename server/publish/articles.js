Meteor.publish('articles', function () {
    return Articles.find();
});

Meteor.publish('mostRecentArticles', function () {
    return Articles.find({}, {
        sort: {createdAt: -1},
        limit: 10,
        fields: {abstract: 0, authors: 0, sections: 0, figures: 0, references: 0}
    });
});