Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = ["home_public", "login", "register", "forgot_password", "reset_password"];
var privateRoutes = ["home_private", "admin", "admin.users", "admin.users.details", "admin.users.insert", "admin.users.edit", "user_settings", "user_settings.profile", "user_settings.change_pass", "logout"];
var zonelessRoutes = ["topics", "publishers", "publications"];

var roleMap = [
{ route: "admin",	roles: ["admin","orgadmin"] },
{ route: "admin.users",	roles: ["admin","orgadmin"] },
{ route: "admin.users.details",	roles: ["admin","orgadmin"] },
{ route: "admin.users.insert",	roles: ["admin"] },
{ route: "admin.users.edit",	roles: ["admin","orgadmin"] },
{ route: "user_settings",	roles: ["user","admin"] },
{ route: "user_settings.profile",	roles: ["user","admin"] },
{ route: "user_settings.change_pass",	roles: ["user","admin"] }
];

this.firstGrantedRoute = function() {
	var grantedRoute = "";
	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});

	if(grantedRoute == "") {
		if(routeGranted("home_private")) {
			return "home_private";
		} else {
			return "home_public";
		}
	}

	return grantedRoute;
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		this.redirect("home_public");
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to private home
			var redirectRoute = firstGrantedRoute();
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute();
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};


Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});


Meteor.subscribe("current_user_data");

Meteor.subscribe("publishers");

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});

Router.map(function () {

	this.route("home_public", {
		path: "/",
		controller: "HomePublicController",
		title: "Home"
	});
	this.route("login", {
		path: "/login",
		controller: "LoginController"
	});
	this.route("register", {
		path: "/register",
		controller: "RegisterController"
	});
	this.route("topics");
	this.route("publishers", {
		title: function () {
			return TAPi18n.__("Publishers");
		}
	});
	this.route('/publishers/:urlname', {
		data: function(){
			return Publishers.findOne({urlname: this.params.urlname});
		},
		template: "ShowPublisher",
		parent: "publishers",
		title: ":urlname" //TODO fix title bug
	});

	this.route("publications");
	this.route("forgot_password", {
		path: "/forgot_password",
		controller: "ForgotPasswordController"
	});
	this.route("reset_password", {
		path: "/reset_password/:resetPasswordToken",
		controller: "ResetPasswordController"
	});
	this.route("home_private", {
		path: "/home_private",
		controller: "HomePrivateController"
	});
	this.route("admin", {
		path: "/admin",
		controller: "AdminController"
	});
	this.route("admin.roles", {
		path: "/admin/roles",
		controller: "AdminRolesController"
	});
	this.route("admin.roles.insert", {
		path: "/admin/roles/insert",
		controller: "AdminRolesInsertController"
	});
	this.route("admin.users", {
		path: "/admin/users",
		controller: "AdminUsersController"
	});
	this.route("admin.users.details", {
		path: "/admin/users/details/:userId",
		controller: "AdminUsersDetailsController"
	});
	this.route("admin.users.insert", {
		path: "/admin/users/insert",
		controller: "AdminUsersInsertController"
	});
	this.route("admin.users.edit", {
		path: "/admin/users/edit/:userId",
		controller: "AdminUsersEditController"
	});
	this.route("user_settings", {
		path: "/user_settings",
		controller: "UserSettingsController"
	});
	this.route("user_settings.profile", {
		path: "/user_settings/profile",
		controller: "UserSettingsProfileController"
	});
	this.route("user_settings.change_pass", {
		path: "/user_settings/change_pass",
		controller: "UserSettingsChangePassController"
	});
	this.route("logout", {
		path: "/logout",
		controller: "LogoutController"
	});
});
