Meteor.startup(function () {
    UploadServer.init({
        tmpDir: Config.uploadXmlDir.tmpDir,
        uploadDir: Config.uploadXmlDir.uploadDir,
        checkCreateDirectories: true, //create the directories for you
        maxFileSize:80000000, //80MB
        overwrite:true,
        finished: function (fileInfo, formFields) {
            Tasks.startJob(Config.uploadXmlDir.uploadDir+fileInfo.path,fileInfo.name,fileInfo.type,formFields);
        }
    })
});



