Meteor.publish('latestFiftyLogs', function() {
    return Logs.find({}, {
        sort: {timestamp: -1},
        limit: 100});
});