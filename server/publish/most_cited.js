Meteor.publish('mostCited', function() {
    return MostCited.find();
});

Meteor.publish('suggestedMostRead', function() {
    return SuggestedArticles.find();
});

