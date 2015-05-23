// Publications.allow({
// 	insert: function (userId, doc) {
// 		return Publications.userCanInsert(userId, doc);
// 	},

// 	update: function (userId, doc, fields, modifier) {
// 		return Publications.userCanUpdate(userId, doc);
// 	},

// 	remove: function (userId, doc) {
// 		return Publications.userCanRemove(userId, doc);
// 	}
// });

Publications.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	if(!doc.createdBy) doc.createdBy = userId;
});

Publications.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

// Publications.before.remove(function(userId, doc) {

// });

// Publications.after.insert(function(userId, doc) {

// });

// Publications.after.update(function(userId, doc, fieldNames, modifier, options) {

// });

// Publications.after.remove(function(userId, doc) {

// });
