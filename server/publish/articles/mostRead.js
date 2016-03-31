Meteor.publish('homepageMostRead', function () {
    var result = createMostReadList();
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
Meteor.publish('homepageMostReadBrief', function () {
    var result = createMostReadList(undefined,5);
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

Meteor.publish('journalMostRead', function (journalId) {
    check(journalId, String);
    var result = createMostReadList(journalId);
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

Meteor.publish('journalMostReadBrief', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    var result = createMostReadList(journalId, 5);
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