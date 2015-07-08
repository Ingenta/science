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
		return str.replace(/\s+/g, '-').toLowerCase();
	},
	getPermissionsByCode : function(code){
		return Permissions.getPermissionsDescriptions()[code];
	},
	getRoleDescByCode:function(code){
		return Permissions.getRolesDescriptions()[code];
	}
});

if (Meteor.isClient) {
	_.extend(Permissions, {
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

Meteor.startup(function(){
	if(Meteor.isServer && Meteor.settings.defaultAdmin){
		var da= _.clone(Meteor.settings.defaultAdmin);
		_.extend(da,{
			profile:{
				name:da.username
			}
		});
		var queryArr = [];
		queryArr.push({emails:{$elemMatch:{address:da.email}}});
		queryArr.push({profile:{name:da.username}});
		if(!Users.findOne({$or:queryArr})){
			console.info("create default user '"+da.username+"'");
			Meteor.call('createUserAccount',da,function(err,userId){
				if(!err && userId){
					console.info("set admin role for user '"+da.username+"'");
					Permissions.delegate(userId,["permissions:admin"]);
				}
			})
		}
	}
});