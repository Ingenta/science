Publications.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
    if (!doc.createdBy) doc.createdBy = userId;
    if (doc.historicalJournal) doc.historicalJournal = _.compact(doc.historicalJournal);
});

Publications.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;
    if (modifier.$set.historicalJournal) modifier.$set.historicalJournal = _.compact(modifier.$set.historicalJournal);
});
