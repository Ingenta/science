this.Images = new FS.Collection("images", {
    stores: [new FS.Store.GridFS("images", {})]
});
Images.allow({
    insert: function (userId, doc) {
        return true;
    },
    update:function(userId,doc){
        return true;
    },
    download: function (userId) {
        return true;
    },
    remove:function(userId){
        return true;
    }
});

//TODO: permission check