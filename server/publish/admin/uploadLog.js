Meteor.publish('uploadPage', function () {
    return [
        UploadLog.find({}, {
            sort: {uploadedAt: -1},
            limit: 20
        }),
        UploadTasks.find({}, {
            sort: {started: -1},
            limit: 100
        })
    ];
});