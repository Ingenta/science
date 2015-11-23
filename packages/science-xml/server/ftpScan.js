Tasks.scanFTP = function(){
    //var ftp = new FTP();
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
                    console.dir(err)
                    console.dir("Download fail:"+listOptions.targetFolder + "/"+ file.name)
                    return
                }
                var moveOptions={
                    oldPath: listOptions.targetFolder + "/"+ file.name,
                    newPath: Config.ftp.moveToDir+"/"+file.name
                }
                console.dir(moveOptions);
                Science.FTP.moveFtpFiles(Science.JSON.MergeObject(Config.ftp.connectOptions,moveOptions),function(err){
                    console.log('move ftp files');
                    console.dir(err);
                    if(err){
                        console.dir(err)
                        console.dir("Move fail:" + err)
                    }
                })
                Tasks.startJob(Config.ftp.downloadDir + "/"+ file.name,file.name,"application/zip")
            }))
        })
    }));
}