Meteor.publish('topics', function() {
    return Topics.find({}, {sort: ['englishName']});
});

Meteor.publish('topicsRelatedArticles', function(id) {
    return Topics.find({_id:id});
});
