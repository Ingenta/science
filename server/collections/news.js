News.allow({
	insert: function (userId, doc) {
		return News.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return News.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return News.userCanRemove(userId, doc);
	}
});

News.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;

	
	if(!doc.userId) doc.userId = userId;
});

News.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

News.before.remove(function(userId, doc) {
	
});

News.after.insert(function(userId, doc) {
	
});

News.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

News.after.remove(function(userId, doc) {
	
});
