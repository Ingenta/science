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
		if(OrbitPermissions.isAdmin(userId)){
			return true;
		}
		if (("$set" in modifier) && ("orbit_roles" in modifier["$set"]) && OrbitPermissions.isUserHavePerm(userId,"permissions:delegate-and-revoke")) {
			var scope = OrbitPermissions.getPermissionRange(userId,"permissions:delegate-and-revoke");
			return OrbitPermissions.userCan("delegate-and-revoke", "permissions", userId, scope)
		}
		return OrbitPermissions.userCan("delegate-and-revoke", "permissions", userId) &&
			((("$addToSet" in modifier) && ("orbit_roles" in modifier["$addToSet"]))
			|| (("$pullAll" in modifier) && ("orbit_roles" in modifier["$pullAll"])))
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