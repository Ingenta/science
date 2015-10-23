Meteor.publish('searchHistory', function() {
    return SearchHistory.find();
});