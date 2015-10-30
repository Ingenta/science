ReactiveTabs.createInterface({
	template: 'accountTabs',
	onChange: function (slug) {
		if(slug !== Session.get('activeTab'))
			Session.set('activeTab', slug);
	}
});

var pageSession = new ReactiveDict();

//Template.AccountTabsTemplate.onRendered(function(){
//	Session.set('activeTab', 'admin');
//});

Template.AdminUsers.rendered = function() {

};

Template.AdminUsers.events({
	
});

Template.AdminUsers.helpers({
	
});
var AdminUsersViewItems = function(cursor, type) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get( type + "SearchString");
	var sortBy = pageSession.get(type + "ViewSortBy");
	var sortAscending = pageSession.get(type + "SortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["username", "emails.address", "orbit_roles"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var AdminUsersViewExport = function(cursor, fileType, type) {
	var data = AdminUsersViewItems(cursor, type);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminUsersView.rendered = function() {
	pageSession.set("AdminUsersViewStyle", "table");
	
};

Template.AdminUsersView.events({
	"click .searchButton": function(e, t) {
		e.stopPropagation();
		var searchInput =Template.instance().$(".searchValue").val().trim();
		console.log(searchInput);
		var key =Template.currentData().type + "SearchString";
		pageSession.set(key, searchInput);
	},

	"keydown .searchValue": function(e, t) {
		e.stopPropagation();
		if(e.keyCode === 13)
		{
			var searchInput =$(e.target).val().trim();
			console.log(searchInput);
			var key =Template.currentData().type + "SearchString";
			pageSession.set(key, searchInput);
		}
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go(Router.current().route.getName() + ".insert", {insId: Router.current().params.insId, pubId: Router.current().params.pubId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminUsersViewExport(this.admin_users, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminUsersViewExport(this.admin_users, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminUsersViewExport(this.admin_users, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminUsersViewExport(this.admin_users, "json");
	}
});

Template.AdminUsersView.helpers({

	"isEmpty": function() {
		return !this.admin_users || this.admin_users.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_users && this.admin_users.count() > 0;
	},
	"isNotFound": function() {
		var type=Template.currentData().type;
		return this.admin_users && pageSession.get(type+"SearchString") && AdminUsersViewItems(this.admin_users , type).length == 0;
	},
	"searchString": function() {
		var type= Template.currentData().type || "";
		return pageSession.get(type+"SearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminUsersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminUsersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminUsersViewStyle") == "gallery";
	},
	"isShowButton": function() {
		var tabs = Session.get("activeTab");
		if(tabs=="normal"){
			return true;
		}
		return false;
	}

	
});


Template.AdminUsersViewTable.rendered = function() {
	
};

Template.AdminUsersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var type =Template.currentData().type;
		var oldSortBy = pageSession.get(type+"ViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set(type+"ViewSortBy", newSortBy);


		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get(type+"SortAscending") || false;
			pageSession.set(type+"SortAscending", !sortAscending);
		} else {
			pageSession.set(type+"SortAscending", true);
		}
	}
});

Template.AdminUsersViewTable.helpers({
	"tableItems": function() {
		var type =Template.currentData().type;
		return AdminUsersViewItems(this.admin_users,type);
	}
});


Template.AdminUsersViewTableItems.rendered = function() {
	
};

Template.AdminUsersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		if (Router.current().route.getName() === "publisher.account" && _.contains(Users.findOne({_id: this._id}, {}).orbit_roles, "publisher:publisher-manager-from-user") && this._id !== Meteor.userId()){
			sweetAlert({
				title             : TAPi18n.__("Warning"),
				text              : TAPi18n.__("Permission denied"),
				type              : "warning",
				showCancelButton  : false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText : TAPi18n.__("OK"),
				closeOnConfirm    : true
			});
			return false;
		}
		Router.go(Router.current().route.getName() + ".edit", {userId: this._id});
		return false;
	},
	"click #edit-button": function(e) {
		e.preventDefault();
		if (Router.current().route.getName() === "publisher.account" && _.contains(Users.findOne({_id: this._id}, {}).orbit_roles, "publisher:publisher-manager-from-user") && this._id !== Meteor.userId()){
			sweetAlert({
				title             : TAPi18n.__("Warning"),
				text              : TAPi18n.__("Permission denied"),
				type              : "warning",
				showCancelButton  : false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText : TAPi18n.__("OK"),
				closeOnConfirm    : true
			});
			return false;
		}
		Router.go(Router.current().route.getName() + ".edit", {userId: this._id});
		return false;
	},
	"click #delete-button": function(e, t) {
		e.preventDefault();
		Permissions.check("delete-user","user");
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Users.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	}
});

Template.AdminUsersViewTableItems.helpers({
	"geti18nName":function(code){
		if(!code){
			return "";
		}
		return Permissions.getRoleDescByCode(code).name;
	}
});

Template.accountOptions.helpers({
	tabs: function () {
		return [
			{name: TAPi18n.__("Admin"), slug: 'admin'},
			{name: TAPi18n.__("Normal User"), slug: 'normal'},
			{name: TAPi18n.__("Publisher"), slug: 'publisher'},
			{name: TAPi18n.__("Institution"), slug: 'institution'}
		];
	},
	activeTab: function () {
		return Session.get('activeTab');
	},
	//info: function () {
	//	var obj = Institutions.findOne({_id: Router.current().params.insId});
	//	return obj;
	//},
	getAdmins: function () {
		return Users.find({orbit_roles: "permissions:admin"}, {});
	},
	getNormals: function () {
		return Users.find(
			{
				$and: [
					{
						$or: [
							{orbit_roles: {$exists: false}},
							{orbit_roles: {$size: 0}}
						]
					},
					{publisherId: {$exists: false}},
					{institutionId: {$exists: false}}
				]
			}, {});
	},
	getPublishers: function () {
		return Users.find({publisherId: {$exists: true}}, {});
	},
	getInstitution: function () {
		return Users.find({institutionId: {$exists: true}}, {});
	}
});

AutoForm.addHooks(['addUploadExcelModalForm'], {
	onSuccess: function (operation, id) {
		$("#addUploadExcelModal").modal('hide');
		FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
		Meteor.call('parseExcel',id);
	}
}, true);