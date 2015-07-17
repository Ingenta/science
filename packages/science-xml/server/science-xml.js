String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

Meteor.startup(function () {
    UploadServer.init({
        tmpDir: Config.uploadXmlDir.tmpDir,
        uploadDir: Config.uploadXmlDir.uploadDir,
        checkCreateDirectories: true, //create the directories for you
        maxFileSize:20000000, //20MB
        finished: function (fileInfo, formFields) {
            Tasks.startJob(Config.uploadXmlDir.uploadDir+fileInfo.path,fileInfo.name,fileInfo.type);
        }
    })
});



