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

            var pathToFile = Config.uploadXmlDir.uploadDir + fileInfo.path;
            var logId = UploadLog.insert({
                name: fileInfo.name,
                uploadedAt: new Date(),
                status: "Pending",
                filePath: pathToFile,
                errors: []
            });


            if (fileInfo.type === "text/xml") {
                //parsexml
                Tasks.parseTaskStart(logId, pathToFile);
                return;
            }

            if (fileInfo.type === "application/zip") {
                //extract to a folder with the same name inside extracted folder
                var zipName = fileInfo.path.substr(0, fileInfo.path.lastIndexOf("."));
                var targetPath = Config.uploadXmlDir.uploadDir + "/extracted" + zipName;
                Tasks.extractTaskStart(logId, pathToFile, targetPath);
                return;
            }
            var errors = [];
            errors.push("File is not suitable");
            Tasks.fail(undefined, logId, errors);
        }
    })
});



