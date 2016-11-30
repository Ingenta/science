Meteor.publish('journalMostCited', function (journalId) {
    if(!journalId)return this.ready();
    check(journalId, String);
    var query = journalId && {journalId: journalId} || {};
    var mostCited = MostCited.find(query,{limit:20,sort: {count: -1}});
    var ids = _.pluck(mostCited.fetch(), 'articleId');
    return [
        Articles.find({_id: {$in: ids}}, {
            fields: articleWithMetadata
        }),
        mostCited
    ]
});
Meteor.publish('journalMostCitedBrief', function (journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    var journalId=journal._id;
    var query = journalId && {journalId: journalId} || {};
    var mostCited = MostCited.find(query,{limit:5,sort: {count: -1}});
    var ids = _.pluck(mostCited.fetch(), 'articleId');
    return [
        Articles.find({_id: {$in: ids}}, {
            fields: {doi: 1, title: 1}
        }),
        mostCited
    ]
});

Meteor.publish('homepageMostCited', function () {
    var mostCited = MostCited.find({},{limit:20,sort: {count: -1}});
    var ids = _.pluck(mostCited.fetch(), 'articleId');
    return [
        Articles.find({_id: {$in: ids}}, {
            fields: articleWithMetadata
        }),
        mostCited
    ]
});
Meteor.publish('homepageMostCitedBrief', function () {
    var mostCited = MostCited.find({},{limit:5,sort: {count: -1}});
    var ids = _.pluck(mostCited.fetch(), 'articleId');
    return [
        Articles.find({_id: {$in: ids}}, {
            fields: {doi: 1, title: 1}
        }),
        mostCited
    ]
});

Meteor.publish('suggestedMostRead', function () {
    return SuggestedArticles.find();
});

Meteor.startup(function () {
    MostCited._ensureIndex({journalId: 1});
});