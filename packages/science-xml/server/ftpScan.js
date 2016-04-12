Tasks.scanFTP = function(){
    var listOptions = {
        ext:"zip",
        targetFolder:"/file"
    };
    Science.FTP.listFiles(Science.JSON.MergeObject(Config.ftp.connectOptions,listOptions),Meteor.bindEnvironment(function(err,list){
        if(_.isEmpty(list)){
            return
        }
        _.each(list,function(file){
            Science.FTP.getSingleFile(Science.JSON.MergeObject(Config.ftp.connectOptions,{sourcePath:listOptions.targetFolder + "/"+ file.name}),Config.ftp.downloadDir + "/"+ file.name,Meteor.bindEnvironment(function(err){
                if(err){
                    logger.error("Download fail:"+listOptions.targetFolder + "/"+ file.name + err.toString())
                    return
                }
                var moveOptions={
                    oldPath: listOptions.targetFolder + "/"+ file.name,
                    newPath: Config.ftp.moveToDir+"/"+file.name
                }
                Science.FTP.moveFtpFiles(Science.JSON.MergeObject(Config.ftp.connectOptions,moveOptions),function(err){
                    if(err){
                        logger.error("Move fail:" + err.toString())
                    }
                })
                importQueue.add({
                    pathToFile:Config.ftp.downloadDir + "/"+ file.name,
                    fileName:file.name,
                    fileType:"application/zip"
                })
                //Tasks.startJob(Config.ftp.downloadDir + "/"+ file.name,file.name,"application/zip")
            }))
        })
    }));
}