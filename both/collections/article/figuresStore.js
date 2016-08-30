var createThumb = function (fileObj, readStream, writeStream) {
    // Transform the image into a 10x10px thumbnail
    //gm(readStream, fileObj.name()).resize('600', '900').stream().pipe(writeStream);
    var maxThumbSize={width:600, height:900};
    logger.info("fileObj's name is:" + fileObj.name());
    logger.info("fileObj's size is:" + fileObj.size());
    gm(readStream, fileObj.name()).filesize({bufferStream: true},function(err,filesize){
        if(err){
            console.log(err.message);
            return;
        }
        //console.log("readStream's size is:" + filesize);
        this.size(function(err, value){
            if(err){
                console.log(err.message);
                return;
            }
            //console.log("size is:" + value.width+"*"+value.height);
            if(value.width>maxThumbSize.width || value.height>maxThumbSize.height){
                this.resize(maxThumbSize.width,maxThumbSize.height)
                //console.log("resize image");
            }
            this.stream(function(err, stdout, stderr){
                if(err){
                    console.log(err.message);
                }
                stdout.pipe(writeStream);
            })
        })
    })

};
FiguresStore = new FS.Collection("figures", {
    stores: [new FS.Store.FileSystem("figures", {
        transformWrite: createThumb,
        path: Config.staticFiles.uploadFiguresDir
    }),new FS.Store.FileSystem("orig_figures", {
        path: Config.staticFiles.uploadFiguresOrigDir
    })],
    filter: {
        allow: {
            contentTypes: ['image/*'] //allow only images in this FS.Collection
        }
    }
});
FiguresStore.allow({
    insert: function (userId, doc) {
        return true;
    },
    download: function (userId) {
        return true;
    },
    update: function (userId) {
        return true;
    }
});
