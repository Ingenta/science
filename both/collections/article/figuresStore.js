var createThumb = function (fileObj, readStream, writeStream) {
    // Transform the image into a 10x10px thumbnail
    gm(readStream, fileObj.name()).resize('600', '1200').stream().pipe(writeStream);
};
FiguresStore = new FS.Collection("figures", {
    stores: [new FS.Store.FileSystem("figures", {
        transformWrite: createThumb,
        path: Config.staticFiles.uploadFiguresDir
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
