minimumArticle = {
    title: 1,
    journalId: 1,
    doi: 1,
    issue: 1,
    issueId: 1,
    volume: 1,
    published: 1,
    publisher: 1,
    createdAt: 1
};
articleWithMetadata = {
    title: 1,
    journalId: 1,
    doi: 1,
    issue: 1,
    issueId: 1,
    volume: 1,
    elocationId: 1,
    startPage: 1,
    endPage: 1,
    year: 1,
    abstract: 1,
    authors: 1,
    accessKey: 1,
    published: 1,//needed for most cited
    citationCount: 1,//needed for most cited
    topic: 1,
    publisher: 1,
    contentType: 1,
    padPage: 1,
    special: 1,
    pdfId: 1,
    createdAt:1
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
    check(id, String);
    return Articles.find({_id: id});
});

Meteor.publish('oneArticleByDoi', function (doi) {
    check(doi, String);
    var a = Articles.find({doi: doi});
    if (a)return a;
    this.ready();
});
Meteor.publish('recommendedMiniPlatformArticles', function (limit) {
    var recommended = NewsRecommend.find({}, {fields: {ArticlesId: 1}}, {sort: {createDate:-1}, limit: limit}).fetch();
    var articleIds = _.pluck(recommended, "ArticlesId");
    return Articles.find({_id: {$in: articleIds}}, {
        fields: articleWithMetadata
    });
});
Meteor.publish('recommendedJournalArticles', function (journalId) {
    check(journalId, String);
    var recommended = EditorsRecommend.find({publications: journalId}, {fields: {ArticlesId: 1}}, {limit: 5}).fetch();
    var articleIds = _.pluck(recommended, "ArticlesId");
    return Articles.find({_id: {$in: articleIds}}, {
        fields: minimumArticle
    });
});
Meteor.publish('articlesInCollection', function (collId) {
    if(!collId)return this.ready();
    check(collId, String);
    var coll = ArticleCollections.findOne({_id: collId})
    if (coll && !_.isEmpty(coll.articles)) {
        return Articles.find({_id: {$in: coll.articles}}, {fields: articleWithMetadata});
    }
    return this.ready();
})

Meteor.publish('oneArticleMeta', function (id) {
    if(!id)return this.ready();
    check(id, String);
    return Articles.find({_id: id}, {fields: articleWithMetadata});
});

Meteor.publish('articlesInTopic', function (topicsId) {
    if(!topicsId)return this.ready();
    check(topicsId, String);
    return Articles.find({topic: topicsId}, {fields: articleWithMetadata});
})


Meteor.publish('articlesInSpecTopic', function (stid) {
    if(!stid)return this.ready();
    check(stid, String);
    var stopic = SpecialTopics.findOne({_id: stid})
    if (stopic && !_.isEmpty(stopic.articles)) {
        return Articles.find({_id: {$in: stopic.articles}}, {fields: articleWithMetadata});
    }
    return this.ready();
})
Meteor.startup(function () {
    Articles._ensureIndex({doi: 1});
});