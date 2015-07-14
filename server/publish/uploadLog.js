Meteor.publish('uploadLog', function() {
    return UploadLog.find();
});
Meteor.publish('uploadTasks', function() {
    return UploadTasks.find();
});