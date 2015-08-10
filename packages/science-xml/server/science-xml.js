Meteor.startup(function () {
    UploadServer.init({
        tmpDir: Config.uploadXmlDir.tmpDir,
        uploadDir: Config.uploadXmlDir.uploadDir,
        checkCreateDirectories: true, //create the directories for you
        maxFileSize:20000000, //20MB
        finished: function (fileInfo, formFields) {
            console.log(formFields);
            Tasks.startJob(Config.uploadXmlDir.uploadDir+fileInfo.path,fileInfo.name,fileInfo.type,formFields);
        }
    })
});



