Tasks.scanFTP = function(){
    var ftp = new FTP();
    var listOptions = {
        ext:"zip",
        targetFolder:"file"
    };
    ftp.listFiles(Science.JSON.MergeObject(Config.ftp.connectOptions,listOptions),function(err,list){
        if(_.isEmpty(list)){
            return
        }
        _.each(list,function(file){
            ftp.getSingleFile(Science.JSON.MergeObject(Config.ftp.connectOptions,{sourcePath:listOptions.targetFolder + "/"+ file.name}),Config.ftp.downloadDir + "/"+ file.name,function(err){
                if(err){
                    console.dir(err)
                    console.dir("Download fail:"+listOptions.targetFolder + "/"+ file.name)
                    return
                }
                var moveOptions={
                    oldPath: listOptions.targetFolder + "/"+ file.name,
                    newPath: Config.ftp.moveToDir
                }
                ftp.moveFtpFiles(Science.JSON.MergeObject(Config.ftp.connectOptions,moveOptions),function(err){
                    if(err){
                        console.dir(err)
                        console.dir("Move fail:" + err)
                    }
                })
                Tasks.startJob(Config.downloadDir + "/"+ file.name,file.name,"application/zip")
            })
        })
    });
}