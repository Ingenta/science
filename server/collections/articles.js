Articles.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
});

Articles.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;
});
