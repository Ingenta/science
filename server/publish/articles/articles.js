minimumArticle = {
    title: 1,
    journalId: 1,
    doi: 1,
    issue: 1,
    issueId: 1,
};
articleWithMetadata = {
    title: 1,
    journalId: 1,
    doi: 1,
    issue: 1,
    issueId: 1,
    volume: 1,
    elocationId: 1,
    year: 1,
    abstract: 1,
    authors: 1,
    accessKey: 1,
    published: 1,//needed for most cited
    citationCount: 1//needed for most cited
};


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

Meteor.publish('oneArticleByDoi', function (doi) {
    return Articles.find({doi: doi});
});