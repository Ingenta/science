Template.AdminRolesChooseForm.helpers({
	"currRole":function(){
		var cr = Permissions.getCustomRoles2(Router.current().params.roleId);
		Session.set("currRole",cr);
		return cr;
	},
	"pkgPermissions": function () {
		var level = this.description.options.level;
		return Permissions.getPermissionsDescriptions2(level);
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