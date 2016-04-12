Meteor.startup(function () {
    UploadServer.init({
        tmpDir: Config.tempFiles.uploadXmlDir.tmpDir,
        uploadDir: Config.tempFiles.uploadXmlDir.uploadDir,
        checkCreateDirectories: true, //create the directories for you
        maxFileSize: 80000000, //80MB
        overwrite: true,
        finished: function (fileInfo, formFields) {
            //Tasks.startJob(Config.tempFiles.uploadXmlDir.uploadDir + fileInfo.path, fileInfo.name, fileInfo.type, formFields);
            importQueue.add({
                pathToFile:Config.tempFiles.uploadXmlDir.uploadDir + fileInfo.path,
                fileName:fileInfo.name,
                fileType:fileInfo.type,
                formFields:formFields
            })
        }
    })
});



