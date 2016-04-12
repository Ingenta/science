importQueue = new PowerQueue({
    maxProcessing: 1,//并发
    maxFailures: 1 //不重试
})

importQueue.errorHandler = function (data) {

};

importQueue.taskHandler = function (data, next) {
    Tasks.startJob(data.pathToFile,data.fileName,data.fileType,data.formFields);
    next();
}