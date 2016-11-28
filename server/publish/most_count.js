Meteor.publish('most_count', function() {
    return MostCount.find();
});

Meteor.publish('homeMostReadArticle', function() {
    var mostRead = MostCount.find({type:"homeMostRead"},{sort:{createDate:-1}, limit: 1});
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    if(_.isEmpty(mostReadArticle[0]))return SuggestedArticles.find();
    return [
        Articles.find({_id: {$in: mostReadArticle[0]}}, {
            fields:articleWithMetadata
        }),
        SuggestedArticles.find(),
        mostRead
    ]
});

Meteor.publish('journalMostReadArticle', function(journalShortTitle) {
    if (!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if (!journal)return this.ready();
    var journalId = journal._id;
    var mostRead = MostCount.find({type:"journalMostRead", journalId:journalId},{sort:{createDate:-1}, limit: 1});
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    if(_.isEmpty(mostReadArticle[0]))return this.ready();
    return [
        Articles.find({_id: {$in: mostReadArticle[0]}}, {
            fields:articleWithMetadata
        }),
        mostRead
    ]
});

Meteor.publish('journalMostReadPage', function(journalId) {
    if (!journalId)return this.ready();
    check(journalId, String);
    var mostRead = MostCount.find({type:"journalMostRead", journalId:journalId},{sort:{createDate:-1}, limit: 1});
    var mostReadArticle = mostRead && _.pluck(mostRead.fetch(), "ArticlesId");
    if(_.isEmpty(mostReadArticle[0]))return this.ready();
    return [
        Articles.find({_id: {$in: mostReadArticle[0]}}, {
            fields:articleWithMetadata
        }),
        mostRead
    ]
});