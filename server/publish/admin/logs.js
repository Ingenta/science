Meteor.publish('latestFiftyLogs', function() {
    return Logs.find({}, {
        sort: {},
        limit: 50});
});