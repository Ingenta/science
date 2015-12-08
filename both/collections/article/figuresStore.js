var createThumb = function(fileObj, readStream, writeStream) {
    // Transform the image into a 10x10px thumbnail
    gm(readStream, fileObj.name()).resize('500', '500').stream().pipe(writeStream);
};
FiguresStore = new FS.Collection("figures", {
    stores: [new FS.Store.FileSystem("figures", { transformWrite: createThumb })],
    filter: {
        allow: {
            contentTypes: ['image/*'] //allow only images in this FS.Collection
        }
    },
    path: Config.staticFiles.uploadFiguresDir
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
