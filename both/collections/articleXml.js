ArticleXml = new FS.Collection("articleXml", {
    stores: [new FS.Store.GridFS("articleXml", {})]
});
ArticleXml.allow({
    insert: function (userId, doc) {
        return true;
    },
    download: function (userId) {
        return true;
    }
});
