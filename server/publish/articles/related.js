Meteor.publish('relatedArticles', function (relatedArticles) {
    if(!relatedArticles)return this.ready();
    var relatedIds = _.pluck(relatedArticles,"_id");
    return [
        Articles.find({_id: {$in: relatedIds}}, {
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