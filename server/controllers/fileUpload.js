Meteor.startup(function () {
    if (Meteor.isServer) {
        //确保上传图片的文件夹存在
        Science.FSE.ensureDir(Config.staticFiles.uploadPicDir, function (err) {
            if (err)
                throw new Meteor.Error(err);
        });
    }
})

