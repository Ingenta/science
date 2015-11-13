Meteor.startup(function(){
    var ftp = new FTP();
    ftp.listFiles({host:"127.0.0.1",user:"liu",password:"123456",port:21,targetFolder:"file",ext:"zip"},function(err,list){
        //console.dir(list);
    });
})