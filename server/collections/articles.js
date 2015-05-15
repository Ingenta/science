Articles.allow({
	insert: function (userId, doc) {
		return Articles.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Articles.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Articles.userCanRemove(userId, doc);
	}
});

Articles.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Articles.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Articles.before.remove(function(userId, doc) {
	
});

Articles.after.insert(function(userId, doc) {
	
});

Articles.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Articles.after.remove(function(userId, doc) {
	
});
