Meteor.publish('most_count', function() {
    return MostCount.find();
});

Meteor.publish('homeMostReadArticle', function() {
    var mostRead = MostCount.find({type:"homeMostRead"},{sort:{createDate:-1}, limit: 1});
    if(!mostRead)return this.ready();
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    return [
        Articles.find({_id: {$in: mostReadArticle[0]}}, {
            fields:articleWithMetadata
        }),
        SuggestedArticles.find(),
        mostRead
    ]
});

Meteor.publish('journalMostReadArticle', function(journalId) {
    check(journalId, String);
    var mostRead = MostCount.find({type:"journalMostRead", journalId:journalId},{sort:{createDate:-1}, limit: 1});
    if(!mostRead)return this.ready();
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    return [
        Articles.find({_id: {$in: mostReadArticle[0]}}, {
            fields:articleWithMetadata
        }),
        SuggestedArticles.find(),
        mostRead
    ]
});