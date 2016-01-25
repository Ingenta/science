var pageSession = new ReactiveDict();

Template.AdminUsersEditEditForm.rendered = function () {
	pageSession.set("adminUsersEditEditFormInfoMessage", "");
	pageSession.set("adminUsersEditEditFormErrorMessage", "");
};

Template.AdminUsersEditEditForm.events({
	"submit"                   : function (e, t) {
		e.preventDefault();
		pageSession.set("adminUsersEditEditFormInfoMessage", "");
		pageSession.set("adminUsersEditEditFormErrorMessage", "");

		function submitAction(msg) {
			var adminUsersEditEditFormMode = "update";
			if (!t.find("#form-cancel-button")) {
				switch (adminUsersEditEditFormMode) {
					case "insert":
					{
						$(e.target)[0].reset();
					}
						;
						break;

					case "update":
					{
						var message = msg || TAPi18n.__("Saved");
						pageSession.set("adminUsersEditEditFormInfoMessage", message);
					}
						;
						break;
				}
			}
			if (Router.current().route.getName() === "admin.institutions.detail.edit") {
				//history.back();
				Router.go("admin.institutions.detail", {insId: Router.current().data().currUser.institutionId});
				//Session.set('activeTab', 'account');
			} else if (Router.current().route.getName() === "publisher.account.edit") {
				Router.go("publisher.account", {pubId: Router.current().data().currUser.publisherId});
			} else {
				Router.go("admin.users", {});
			}
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminUsersEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function (fieldName, fieldValue) {

			},
			function (msg) {

			},
			function (values) {
				var scope={};
				if(values.publisherId)
					scope.publisher=values.publisherId;
				if(values.institutionId)
					scope.institution = values.institutionId;
				Permissions.check("modify-user", "user", scope);
				var getScopeVals = function(selector){
					var scopeEle = $(selector);
					if(scopeEle.length){
						return scopeEle.select2 && scopeEle.select2('val');
					}
				}
				var roles = _.map($(".roles:checked"),function(ckBoxRole){
					var scopeEle = ckBoxRole.nextElementSibling;
					if(scopeEle && $(scopeEle).attr('class')==='coll-trigger'){
						var selector = $(scopeEle).data().target;
						var scope = {};

						var pscope = getScopeVals(selector + " .delegate-publisher");
						if(!_.isEmpty(pscope))
							scope.publisher = pscope;

						var jscope = getScopeVals(selector + " .delegate-journal");
						if(!_.isEmpty(jscope))
							scope.journal=jscope;

						var iscope = getScopeVals(selector + " .delegate-institution");
						if(!_.isEmpty(iscope))
							scope.institution = iscope

						if(!_.isEmpty(scope))
							return {role:ckBoxRole.value,scope:scope};
					}
					return ckBoxRole.value;
				});
				Meteor.call("updateUserAccount", Router.current().data().currUser._id, values, function (e) {
					if (e) errorAction(e.message);
					else {
						//var rolesAtThisLevel = Permissions.getRolesDescriptions2(Router.current().data().currUser.level, false)
						//var rolesForSet      = _.map(roles, function (role) {
						//	var scope = {};
						//	if (values.publisherId) scope.publisher = [values.publisherId];
						//	if (values.journalId) scope.journal = [values.journalId];
						//	if (values.institutionId) scope.institution = [values.institutionId];
						//	var r = rolesAtThisLevel[role];
						//	if (!_.isEmpty(scope)) {
						//		return {"role": role, scope: scope};
						//	} else {
						//		return role;
						//	}
						//});
						Permissions.setRoles(Router.current().data().currUser._id, roles, function (err) {
							if (err) {
								console.log(err);
							}
						});
						submitAction();
					}
				});

			}
		);

		return false;
	},
	"click #form-cancel-button": function (e, t) {
		e.preventDefault();
		if (Router.current().route.getName() === "admin.institutions.detail.edit") {
			//history.back();
			Router.go("admin.institutions.detail", {insId: Router.current().data().currUser.institutionId});
			//Session.set('activeTab', 'account');
		} else if (Router.current().route.getName() === "publisher.account.edit") {
			Router.go("publisher.account", {pubId: Router.current().data().currUser.publisherId});
		} else {
			Router.go("admin.users", {});
		}
	}
});

Template.AdminUsersEditEditForm.helpers({
	"infoMessage"           : function () {
		return pageSession.get("adminUsersEditEditFormInfoMessage");
	},
	"errorMessage"          : function () {
		return pageSession.get("adminUsersEditEditFormErrorMessage");
	},
	"disableStatus"         : function () {
		return Router.current().data().currUser.disable ? "checked" : "";
	},
	"emailAddress"          : function () {
		var e = Router.current().data().currUser.emails[0];
		if(e)return e.address;
	},
	"getInstitutionNameById": function () {
		var i = Institutions.findOne({_id: Router.current().data().currUser.institutionId});
		if(i)return i.name;
	},
	"getPublisherNameById"  : function () {
		return Publishers.findOne({_id: Router.current().data().currUser.publisherId}, {
			fields: {
				chinesename: 1,
				name       : 1
			}
		});
	},
	"getJournals"           : function () {
		return Publications.find({publisher: Router.current().data().currUser.publisherId}, {titleCn: 1, title: 1});
	},
	"setJournalId"          : function () {
		Session.set("journalId", Router.current().data().currUser.journalId);
	},
	"getJournalId"          : function () {
		return Session.get("journalId");
	},
	"canEditRoles"      : function (publisherId) {
		return Permissions.userCan("delegate-and-revoke", "permissions", Meteor.userId(), {publisher: publisherId});
	}
});

Template.userEditRoles.helpers({
	"getRoles": function () {
		var user = Router.current().data().currUser;
		if (!user) {
			console.error("Missing currUser!");
			return
		}
		var level = user.level || Permissions.level.normal;
		return OrbitPermissions.getRolesDescriptions2(level, true);
	},
	"roleInfo": function () {
		var user = Router.current().data().currUser;
		var info = {
			code     : this.name,
			name     : this.description.name,
			level    : this.description.options.level,
			userRoles: user.orbit_roles || {}
		};
		var cu   = Permissions.getUserRoles(user._id)
		if (cu) {
			var role = _.find(cu, function (c) {
				return c === info.code || c.role === info.code;
			})
			if (role)
				info.checked = "checked"
		}
		return info;
	}
});
