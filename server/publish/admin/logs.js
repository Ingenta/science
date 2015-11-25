Meteor.publish('latestFiftyLogs', function() {
    return Logs.find({}, {limit: 50});
});