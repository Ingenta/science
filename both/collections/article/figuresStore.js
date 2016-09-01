FS.debug=false;

FiguresStore = new FS.Collection("figures", {
    stores: [new FS.Store.FileSystem("figures", {
        transformWrite: function(fileObj,readStream,writeStream){
            gm(readStream, fileObj.name()).resize('600', '900').stream().pipe(writeStream);
        },
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
