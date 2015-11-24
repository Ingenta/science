FiguresStore = new FS.Collection("figures", {
    stores: [new FS.Store.FileSystem("figures", {})],
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
