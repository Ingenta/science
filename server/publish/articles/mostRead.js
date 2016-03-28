Meteor.publish('mostRead', function (journalId, limit) {
    check(journalId, String);
    check(limit, Number);
    var result = createMostReadList(journalId, limit);
    return [
        Articles.find({_id: {$in: result}}, {
            fields: articleWithMetadata
        }),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        }),
        SuggestedArticles.find()
    ]

});