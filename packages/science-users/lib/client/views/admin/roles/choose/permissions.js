Template.AdminRolesChooseForm.helpers({
	"pkgPermissionsGroupPrefixs":function(){
		var keys = Permissions.getPermissions();
		var permsGroup= _.groupBy(keys,function(str){
			return str.split(':')[0];
		});
		console.log(permsGroup);
		delete permsGroup.permissions;// 前面已经显示过角色管理权限，所以删除掉
		return Object.keys(permsGroup);
	}
});

Template.singleGroup.helpers({
	"pkgPermissionsGroup":function(){
		var prefix=this.toString();
		var keys = Permissions.getPermissions();
		var permsGroup= _.filter(keys,function(str){
			return str.indexOf(prefix)==0;
		});
		return permsGroup;
	}
});