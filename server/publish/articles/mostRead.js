Meteor.publish('mostRead', function (journalId, limit) {
    var result = getMostReadByJournal(journalId, limit);
    result = _.pluck(result, '_id');
    result = _.pluck(result, 'articleId');
    var suggestion = getMostReadSuggestion(journalId);
    if(suggestion)result.push(suggestion);
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
        SuggestedArticles.find()
    ]

});