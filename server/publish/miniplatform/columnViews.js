Meteor.publish('column_views', function() {
    return ColumnViews.find();
});

Meteor.publish('miniPlatformColumnViews', function(columnId) {
    return ColumnViews.find({columnId: columnId},{sort: {releaseTime: -1}});
});