//Meteor.publish('articles', function () {
//    return Articles.find();
//});
var minimumArticle = {
    title: 1,
    journalId: 1,
    doi: 1,
    issueId: 1
};
var articleWithMetadata = {
    title: 1,
    journalId: 1,
    doi: 1,
    issueId: 1,
    volume: 1,
    elocationId: 1,
    year: 1,
    abstract: 1,
    authors: 1,
    accessKey: 1
};

Meteor.publish('articlesWithoutFulltext', function () {
    return Articles.find({}, {
        fields: {sections: 0}
    });
});

Meteor.publish('articleSearchResults', function () {
    return [Articles.find({}, {
        fields: articleWithMetadata
    }),
        Publishers.find(),
        Publications.find()
    ]
});

Meteor.publish('oneArticle', function (id) {
    return Articles.find({_id: id});
});

Meteor.publish('oneJournalArticles', function (id) {
    return Articles.find({journalId: id}, {
        fields: {sections: 0, figures: 0, references: 0}
    });
});


//TODO publish just enough for english and chinese title, and url content
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
        }),
        Issues.find({}, {
            fields: {volume: 1, issue: 1}
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
        }),
        Issues.find({}, {
            fields: {volume: 1, issue: 1}
        })
    ]
});

Meteor.publish('articleUrls', function () {
    return [
        Articles.find({}, {
            fields: minimumArticle
        }),
        Publishers.find(),
        Publications.find()
    ]
});