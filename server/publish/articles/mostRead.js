Meteor.publish('mostRead', function (journalId) {
    var result = getMostReadByJournal(journalId);
    result = _.pluck(result, '_id');
    result = _.pluck(result, 'articleId');
    return [
        Articles.find({_id: {$in: result}}, {
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
        }),
        SuggestedArticles.find()
    ]

});