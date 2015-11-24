FiguresStore = new FS.Collection("articleXml", {
    stores: [new FS.Store.GridFS("articleXml", {})]
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
