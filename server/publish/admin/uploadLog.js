Meteor.publish('uploadLog', function() {
    return UploadLog.find({}, {
        sort: {uploadedAt: -1},
        limit: 50});
});
Meteor.publish('uploadTasks', function() {
    return UploadTasks.find();
});