FS.debug=true;
Science.ThumbUtils={};

var maxThumbSize={width:600, height:900};

var thumbQueue = new PowerQueue({
    maxProcessing: 3,//并发
    maxFailures: 1 //不重试
})

thumbQueue.taskHandler = function (data, next) {
    var fileObj = FiguresStore.findOne({_id:data})
    var readStream = fileObj.createReadStream('orig_figures');
    var writeStream = fileObj.createWriteStream('figures');
    gm(readStream, fileObj.name()).resize('600', '900').stream().pipe(writeStream);
    next();
}

Science.ThumbUtils.addCreateThumbTasks = function(imageIdArr){
    _.each(imageIdArr,function(imageId){
        thumbQueue.add(imageId);
    })
}