Meteor.publish('column_views', function() {
    return ColumnViews.find();
});