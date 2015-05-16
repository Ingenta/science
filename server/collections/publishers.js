Publishers.allow({
    insert: function (userId, doc) {
        return Publishers.userCanInsert(userId, doc);
    },

    update: function (userId, doc, fields, modifier) {
        return Publishers.userCanUpdate(userId, doc);
    },

    remove: function (userId, doc) {
        return Publishers.userCanRemove(userId, doc);
    }
});
