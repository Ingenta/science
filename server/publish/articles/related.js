Meteor.publish('relatedArticles', function (relatedArticles) {
    var relatedIds = _.pluck(relatedArticles,"_id");
    return [
        Articles.find({_id: {$in: relatedIds}}, {
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