var OrbitPermissions;

OrbitPermissions = share.OrbitPermissions;

Meteor.publish(null, function() {
	return OrbitPermissions.custom_roles.find({});
});

Meteor.publish(null, function() {
	var fields;
	fields = {};
	fields[globals.roles_field_name] = 1;
	return Meteor.users.find({
		_id: this.userId
	}, {
		fields: fields
	});
});

Meteor.users.allow({
	update: function(userId, doc, fieldNames, modifier) {
		return OrbitPermissions.userCan("delegate-and-revoke", "permissions", userId) && ((("$addToSet" in modifier) && ("orbit_roles" in modifier["$addToSet"])) || (("$pullAll" in modifier) && ("orbit_roles" in modifier["$pullAll"])));
	}
});

OrbitPermissions.custom_roles.allow({
	insert: function(userId, doc) {
		return OrbitPermissions.userCan("edit-custom-roles", "permissions", userId);
	},
	remove: function(userId, doc) {
		return OrbitPermissions.userCan("edit-custom-roles", "permissions", userId);
	}
});