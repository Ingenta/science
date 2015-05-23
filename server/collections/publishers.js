// Publishers.allow({
//     insert: function (userId, doc) {
//         return Publishers.userCanInsert(userId, doc);
//     },

//     update: function (userId, doc, fields, modifier) {
//         return Publishers.userCanUpdate(userId, doc);
//     },

//     remove: function (userId, doc) {
//         return Publishers.userCanRemove(userId, doc);
//     }
// });
Publishers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
    if(!doc.createdBy) doc.createdBy = userId;
});

Publishers.before.update(function(userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;
});
