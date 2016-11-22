Meteor.publish('uploadPage', function () {//TODO this should use one collection for all tasks and subtasks not two
    return [
        UploadLog.find({}, {
            sort: {uploadedAt: -1},
            limit: 100
        }),
        UploadTasks.find({}, {
            sort: {started: -1},
            limit: 100
        })
    ];
});