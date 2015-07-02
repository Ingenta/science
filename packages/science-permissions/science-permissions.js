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
		//getCustomRoles: function () {
		//	var customSymbol = "project-custom:";
		//	var allRoles     = Permissions.getRoles();
		//	var keys         = Object.keys(allRoles);
		//	var descs        = Permissions.getRolesDescriptions();//服务端没有这个方法。
		//	keys      = _.filter(keys, function (str) {
		//		return str.indexOf(customSymbol) == 0;
		//	});
		//	var roles = [];
		//	_.each(keys, function (item, index) {
		//		var sn = item.substr(customSymbol.length);
		//		roles.push({
		//			name       : item,
		//			shortName  : sn,
		//			desc       : descs[item],
		//			permissions: allRoles[item]
		//		});
		//	});
		//	return roles;
		//},
		getCustomRoles2:function(id){  // better way
			if(id){
				return Permissions.custom_roles.findOne({_id:id});
			}
			return Permissions.custom_roles.find();
		},
		updateRolesPermissions:function(roleName,perms){
			try{
				debugger
				Permissions.custom_roles.update({_id:roleName},{$set:{permissions:perms}});
				return true;
			}catch(e){
				throw e;
			}
		}
	})
}