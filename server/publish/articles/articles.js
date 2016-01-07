minimumArticle = {
    title: 1,
    journalId: 1,
    doi: 1,
    issue: 1,
    issueId: 1,
    volume: 1,
    published: 1,
    publisher:1
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
    citationCount: 1,//needed for most cited
    topic:1,
    publisher:1
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
Meteor.publish('recommendedMiniPlatformArticles', function () {
    var recommended = NewsRecommend.find({}, {fields: {ArticlesId: 1}}).fetch();
    var articleIds = _.pluck(recommended, "ArticlesId");
    return Articles.find({_id: {$in: articleIds}}, {
        fields: articleWithMetadata
    });
});
Meteor.publish('recommendedJournalArticles', function (val) {
    var recommended = EditorsRecommend.find({publications:val}, {fields: {ArticlesId: 1}}).fetch();
    var articleIds = _.pluck(recommended, "ArticlesId");
    return Articles.find({_id: {$in: articleIds}}, {
        fields: minimumArticle
    });
});
Meteor.publish('articlesInCollection',function(collId){
    var coll = ArticleCollections.findOne({_id:collId})
    if(coll && !_.isEmpty(coll.articles)){
        return Articles.find({_id:{$in:coll.articles}},{fields:articleWithMetadata});
    }
    return Articles.find({_id:"null"});//return null 会导致客户端一直等待.
})

Meteor.publish('oneArticleMeta', function (id) {
    return Articles.find({_id: id},{fields:articleWithMetadata});
});

Meteor.publish('articlesInTopic',function(topicsId){
    return Articles.find({topic: topicsId},{fields:articleWithMetadata});
})


Meteor.publish('articlesInSpecTopic',function(stid){
    var stopic = SpecialTopics.findOne({_id:stid})
    if(stopic && !_.isEmpty(stopic.articles)){
        return Articles.find({_id:{$in:stopic.articles}},{fields:articleWithMetadata});
    }
    return Articles.find({_id:"null"});//return null 会导致客户端一直等待.
})