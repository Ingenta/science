Template.AdminUsersView.helpers({

	"isNotEmpty": function() {

		return Meteor.users.find({level:this.level}).count()
	},

	"searchString": function() {
		return Session.get("user-search-string-for-"+this.level);
	},
	"userDatas": function() {
		var searchStr = Session.get("user-search-string-for-"+this.level)
		var query={level:this.level};
		if(this.additional && this.additional.institutionId)
			query.institutionId=this.additional.institutionId;
		if(searchStr)
			query.username={$regex:searchStr};
		return Meteor.users.find(query)
	}
});

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

Template.userRolesView.helpers({
	isNormalType:function(){
		return !this.scope
	},
	name:function(){
		return Permissions.getRoleDescByCode(this.role || this).name
	}
})

Template.userRolesView.events({
	//'click a.role-scope': function (e) {
	//	e.preventDefault();
	//	e.stopPropagation();
	//	var ele = $(event.currentTarget);
	//	var content = Blaze.toHTMLWithData(Template.permissionScopeView, {
	//		scope:this.scope
	//	});
	//	ele.popover({
	//		title: TAPi18n.__("Scope"),
	//		html:true,
	//		content: content
	//	});
	//	ele.popover('show');
	//},
	//'hidden.bs.popover a.role-scope': function (event) {
	//	$(event.target).popover('destroy');
	//}
})

Template.permissionScopeView.helpers({
	publisherName:function(){
		var obj=Publishers.findOne({_id:this.toString()},{fields:{name:1,chinesename:1}});
		return TAPi18n.getLanguage()==='zh-CN'?obj.chinesename:obj.name;
	}
})

Template.userButtons.helpers({
	"isNormalTab": function() {
		return this.level === "normal"
	},
	"isNotEmpty":function(){
		return Meteor.users.find({level:this.level}).count()
	},
	"searchString":function(){
		return Session.get("user-search-string-for-"+this.level)
	}
})

Template.userButtons.events({

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var inputEle = t.find("#dataview-search-input");
		var searchStr = (inputEle && inputEle.value) || "";
		Session.set("user-search-string-for-"+this.level,searchStr)
	},

	"keydown #dataview-search-input": function(e, t) {
		var inputEle = t.find("#dataview-search-input");
		var searchStr = (inputEle && inputEle.value) || "";
		if(e.which === 13)//enter
		{
			e.preventDefault();
			Session.set("user-search-string-for-"+this.level,searchStr)
		}
		if(e.which === 27)//esc
		{
			e.preventDefault();
			Session.set("user-search-string-for-"+this.level,searchStr)
		}
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		var query={query:"level="+this.level};
		if(this.additional && this.additional.institutionId)
			query.query=query.query+ "&institutionId="+this.additional.institutionId;
		Router.go(Router.current().route.getName() + ".insert", {insId: Router.current().params.insId, pubId: Router.current().params.pubId},query);
	}
})
