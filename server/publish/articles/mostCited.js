Meteor.publish('mostCited', function (journalId) {
    var mostCited = MostCited.find();
    if (journalId)mostCited = MostCited.find({journalId: journalId});
    var ids = _.pluck(mostCited.fetch(), 'articleId');
    return [
        Articles.find({_id: {$in: ids}}, {
            fields: articleWithMetadata
        }),
        MostCited.find(),
        Publishers.find({}, {
            fields: {shortname: 1}
        }),
        Publications.find({}, {
            fields: {publisher: 1, shortTitle: 1, title: 1, titleCn: 1}
        })
    ]
});

Meteor.publish('suggestedMostRead', function () {
    return SuggestedArticles.find();
});

