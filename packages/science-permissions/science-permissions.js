Permissions = OrbitPermissions;

_.extend(Permissions,{
	isNameExists:function(name){
		name=space2dash(name);
		var customs = Permissions.getCustomRoles();
		return !!_.findWhere(customs,{shortName:name});
	},
	space2dash:function(str){
		str=str.trim();
		return str.replace(/\s+/g,'-')
	}
});

if(Meteor.isClient){
	_.extend(Permissions,{
		getCustomRoles:function(){
			var customSymbol="project-custom:";
			var keys = Object.keys(Permissions.getRoles());
			var descs = Permissions.getRolesDescriptions();
			keys= _.filter(keys,function(str){
				return str.indexOf(customSymbol) == 0;
			});
			var roles=[];
			_.each(keys,function(item,index){
				var sn=item.substr(customSymbol.length);
				roles.push({name:item,shortName:sn,desc:descs[item]});
			});
			return roles;
		}
	})
}