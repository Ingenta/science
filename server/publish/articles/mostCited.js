Meteor.publish('mostCited', function (journalId, limit) {
    if(!limit)limit=20;
    var query = journalId && {journalId: journalId} || {};
    var mostCited = MostCited.find(query,{limit:limit,sort: {count: -1}});
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

