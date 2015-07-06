Template.AdminRolesChooseForm.helpers({
	"currRole":function(){
		var cr = Permissions.getCustomRoles2(Router.current().params.roleId);
		Session.set("currRole",cr);
		return cr;
	},
	"pkgPermissionsGroupPrefixs": function () {
		var keys       = Permissions.getPermissions();
		var permsGroup = _.groupBy(keys, function (str) {
			return str.split(':')[0];
		});
		delete permsGroup.permissions;// 前面已经显示过角色管理权限，所以删除掉
		return Object.keys(permsGroup);
	},
	"isUserHasThisPerm"  : function (permName) {
		return Session.get("currRole").permissions.indexOf(permName) > -1 ? "checked" : "";
	}
});

Template.singleGroup.helpers({
	"pkgPermissionsGroup": function () {
		var prefix     = this.toString();
		var perms      = Permissions.getPermissions();
		var permsGroup = _.filter(perms, function (str) {
			return str.indexOf(prefix) == 0;
		});
		return permsGroup;
	},
	"isUserHasThisPerm"  : function (permName) {
		return Session.get("currRole").permissions.indexOf(permName) > -1 ? "checked" : "";
	},
	"geti18nName":  function(permCode){
		return Permissions.getPermissionsByCode(permCode).name;
	}
});

Template.AdminRolesChooseForm.events({
	"click #form-submit-button": function(e){
		e.preventDefault();
		var selected = $("input[type='checkbox'][name='permiss']:checked");
		var perms = [];
		_.each(selected,function(item,index){
			perms.push($(item).val());
		});
		if(Permissions.updateRolesPermissions(Session.get("currRole")._id,perms)){
			Router.go("admin.roles",{});
		}else{
			alert('更新失败');
		}

	},
	"click #form-cancel-button": function(e){
		e.preventDefault();
		Router.go("admin.roles",{});
	}
});