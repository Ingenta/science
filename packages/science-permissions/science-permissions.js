Permissions = OrbitPermissions;

Permissions.custom_roles.allow({
	update:function (userId, doc) {
		return OrbitPermissions.userCan("edit-custom-roles",
			"permissions", userId);
	}
});

_.extend(Permissions, {
	isNameExists: function (name) {
		name        = space2dash(name);
		var customs = Permissions.getCustomRoles();
		return !!_.findWhere(customs, {shortName: name});
	},
	space2dash  : function (str) {
		str = str.trim();
		return str.replace(/\s+/g, '-')
	}
});

if (Meteor.isClient) {
	_.extend(Permissions, {
		getCustomRoles2:function(id){  // better way
			if(id){
				return Permissions.custom_roles.findOne({_id:id});
			}
			return Permissions.custom_roles.find();
		}
	})
}