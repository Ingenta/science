Journals.allow({
	insert: function (userId, doc) {
		return Journals.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Journals.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Journals.userCanRemove(userId, doc);
	}
});

Journals.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Journals.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Journals.before.remove(function(userId, doc) {
	
});

Journals.after.insert(function(userId, doc) {
	
});

Journals.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Journals.after.remove(function(userId, doc) {
	
});
