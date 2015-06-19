Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading",
	progressDelay : 100,
	progressSpinner : false
});

Meteor.subscribe("current_user_data");

Meteor.subscribe("issues");

Meteor.subscribe("about");

Meteor.subscribe("volumes");

Meteor.subscribe("about_articles");

Meteor.subscribe('articleXml');

Meteor.subscribe('uploadLog')


var publicRoutes = ["home_public", "login", "register", "forgot_password", "reset_password"];
var privateRoutes = ["home_private", "admin", "admin.users", "admin.users.details", "admin.users.insert", "admin.users.edit", "user_settings", "user_settings.profile", "user_settings.change_pass", "logout"];
var zonelessRoutes = ["topics", "publishers", "publications", "collections"];

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




Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});

Router.map(function () {

	this.route("home_public", {
		path: "/",
		controller: "HomePublicController",
		title: function () {
			return TAPi18n.__("Home");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('news')
			]
		}
	});
	this.route("home_private", {
		path: "/home_private",
		controller: "HomePrivateController",
		title: function () {
			return TAPi18n.__("Home");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('news')
			]
		}
	});
	this.route("login", {
		parent: "home_private",
		path: "/login",
		controller: "LoginController",
		title: function () {
			return TAPi18n.__("Login");
		}
	});
	this.route("register", {
		parent: "home_private",
		path: "/register",
		controller: "RegisterController",
		title: function () {
			return TAPi18n.__("Register");
		}
	});
	this.route("topics",{
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Topics");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('topics')
			]
		}
	});

	this.route('/topic/:topicQuery', {
		template: "SearchResults",
		parent: "topics",
		title: ":topicQuery",
		waitOn: function () {
			return [
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articles')
			]
		}
	});

	this.route("author",{
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Author");
		}
	});

	this.route('/author/:authorQuery', {
		template: "SearchResults",
		parent: "home_private",
		title: ":authorQuery",
		waitOn: function () {
			return [
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articles')
			]
		}
	});

	this.route("collections",{
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Collections");
		}
	});
	this.route("publications",{
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Publications");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('publishers')
			]
		}
	});
	this.route("publishers", {
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Publishers");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications')
			]
		}
	});

	this.route('/s/:searchQuery', {
		template: "SearchResults",
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Search");
		},
		waitOn: function () {
			return [
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articles')
			]
		}
	});


	this.route('/publisher/:publisherName', {
		data: function(){
			var pub = Publishers.findOne({name: this.params.publisherName});
			if(pub){
				Session.set('currentPublisher',pub._id);
				return pub;
			}

		},
		template: "ShowPublisher",
		parent: "publishers",
		title: function(){
			if(TAPi18n.getLanguage() === "en") return ":publisherName";
			var id =Session.get('currentPublisher');
			return Publishers.findOne({_id:id}).chinesename;
		},
		name: "publisher.name",
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('publishers')
			]
		}
	});

	this.route('/publisher/:publisherName/journal/:journalTitle', {
		data: function(){
			var pub = Publishers.findOne({name: this.params.publisherName});
			var journal = Publications.findOne({title: this.params.journalTitle});
			if(journal){
				Session.set('currPublication',journal._id);
				Session.set('currentPublisher',pub._id);
				return journal;
			}
		},
		template: "ShowJournal",
		title: ":journalTitle",
		parent: "publisher.name",
		name: "journal.name",
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articles'),
			Meteor.subscribe('about'),
			Meteor.subscribe('about_articles')
			]
		}

	});

	this.route('/publisher/:publisherName/journal/:journalTitle/article/:articleName', {
		data: function(){
			var pub = Publishers.findOne({name: this.params.publisherName});
			var journal = Publications.findOne({title: this.params.journalTitle});
			if(pub){
				Session.set('currPublication',pub._id);
				Session.set('currentPublisher',journal._id);
				return Articles.findOne({title: this.params.articleName});
			}
		},
		template: "showArticle",
		title: ":articleName",
		parent: "journal.name",
		waitOn: function () {
			return [
			Meteor.subscribe('images'),
			Meteor.subscribe('publishers'),
			Meteor.subscribe('publications'),
			Meteor.subscribe('articles')
			]
		}
	});

	this.route("forgot_password", {
		path: "/forgot_password",
		controller: "ForgotPasswordController",
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Forgot password");
		}
	});
	this.route("reset_password", {
		path: "/reset_password/:resetPasswordToken",
		controller: "ResetPasswordController",
		parent: "home_private",
		title: function () {
			return TAPi18n.__("Reset password");
		}
	});

	this.route("admin", {
		path: "/admin",
		controller: "AdminController",
		title: function () {
			return TAPi18n.__("Admin");
		},
		parent: "home_private"
	});
	this.route("admin.roles", {
		path: "/admin/roles",
		controller: "AdminRolesController"
	});
	this.route("admin.roles.insert", {
		path: "/admin/roles/insert",
		controller: "AdminRolesInsertController"
	});
	this.route("admin.upload", {
		path: "/admin/upload",
		title: function () {
			return TAPi18n.__("Upload");
		},
		parent: "admin"
	});

	this.route("admin.users", {
		path: "/admin/users",
		controller: "AdminUsersController",
		title: function () {
			return TAPi18n.__("Users");
		},
		parent: "admin"
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
	this.route("testTemplate", {
		path: "/testTemplate"
	});
	this.route("editseaTemp", {
		path: "/editseaTemp"
	});
	this.route("searchResult", {
		path: "/searchResult"
	});
});
