Meteor.publish('uploadLog', function() {
    return UploadLog.find();
});