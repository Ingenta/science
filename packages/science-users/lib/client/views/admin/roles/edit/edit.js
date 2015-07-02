Template.AdminRolesEditForm.events({
	"submit #form"             : function (e) {
		e.preventDefault();
		var roleName    = $("input[name='name']").val();
		var roleSummary = $("input[name='summary']").val();
		if (roleName && roleName.trim()) {
			roleName = roleName.trim();
			Permissions.undefineCustomRole(this._id, function (err) {
				if (err) {
					alert(err);
					return;
				}
				Permissions.defineCustomRole(Permissions.space2dash(roleName), [], {
					en: {
						name   : roleName.trim(),
						summary: roleSummary
					}
				}, function (err, id) {
					if (err) {
						alert(err);
						return;
					}
					Router.go("admin.roles", {});
				});
			});

		} else {
			alert('请填写角色名称');
		}

	},
	"click #form-cancel-button": function (e, t) {
		e.preventDefault();
		Router.go("admin.roles", {});
	},

});

Template.AdminRolesEditForm.helpers({
	"roleName"   : function () {
		return this.description.en.name;
	},
	"roleSummary": function () {
		return this.description.en.summary;
	},
	"currRole"   : function () {
		return Permissions.getCustomRoles2(Router.current().params.roleId);
	}
});
