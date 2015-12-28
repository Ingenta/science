var getSearchStrKey = function(){
	var obj=Science.JSON.MergeObject({},{level:this.level},this.scope);
	var searchStrKey = _.reduce(obj,function(mem,val,key){
		if(val)
			return mem+"-"+key+"-"+val
		return mem;
	},"user-search-string");
	return searchStrKey;
};
var getQuery = function(searchStr){
	var query={};
	if(this.level){
		if(this.level===Permissions.level.publisher)
			_.extend(query,{level:{$in:[Permissions.level.publisher,Permissions.level.journal]}})
		else
			_.extend(query,{level:this.level})
	}

	if(!_.isEmpty(this.scope))
		_.extend(query,this.scope);
	if(searchStr)
		_.extend(query,{username:{$regex:searchStr}});
	return query;
}

Template.AdminUsersView.helpers({
	"isNotEmpty": function() {
		return Meteor.users.find(getQuery.call(this)).count()
	},
	"searchString": function() {
		return Session.get(getSearchStrKey.call(this));
	},
	"userDatas": function() {
		var searchStr = Session.get(getSearchStrKey.call(this));
		var query = getQuery.call(this,searchStr);
		return Meteor.users.find(query)
	}
});

Template.AdminUsersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		//if (Router.current().route.getName() === "publisher.account" && _.contains(Users.findOne({_id: this._id}, {}).orbit_roles, "publisher:publisher-manager-from-user") && this._id !== Meteor.userId()){
		if (!(Permissions.userCan("modify-user","user",Meteor.userId(),Router.current().data().scope) && this._id !== Meteor.userId())){
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
		if (!Permissions.userCan("modify-user","user",Meteor.userId(),Router.current().data().scope)){
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
	}
});

Template.AdminUsersViewTableItems.helpers({
	"geti18nName":function(code){
		if(!code){
			return "";
		}
		return Permissions.getRoleDescByCode(code).name;
	},
	"canModify":function(){
		return Permissions.userCan("modify-user","user",Meteor.userId(),Router.current().data().scope) && (this._id !== Meteor.userId()); //用户不可以在用户管理页中修改自己的信息
	}
});

Template.userRolesView.helpers({
    isNormalType: function () {
        return !this.scope
    },
    name: function () {
        var roleDescription = Permissions.getRoleDescByCode(this.role || this);
        return roleDescription && roleDescription.name;
    }
});

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
});

Template.permissionScopeView.helpers({
	publisherName:function(){
		var obj=Publishers.findOne({_id:this.toString()},{fields:{name:1,chinesename:1}});
		return TAPi18n.getLanguage()==='zh-CN'?obj.chinesename:obj.name;
	}
});

Template.userButtons.helpers({
	"isNormalTab": function() {
		return this.level === "normal"
	},
	"isNotEmpty":function(){
		return Meteor.users.find(getQuery.call(this)).count()
	},
	"searchString":function(){
		return Session.get(getSearchStrKey.call(this))
	}
});

Template.userButtons.events({

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var inputEle = t.find("#dataview-search-input");
		var searchStr = (inputEle && inputEle.value) || "";
		Session.set(getSearchStrKey.call(this),searchStr)
	},

	"keydown #dataview-search-input": function(e, t) {
		var inputEle = t.find("#dataview-search-input");
		var searchStr = (inputEle && inputEle.value) || "";
		if(e.which === 13)//enter
		{
			e.preventDefault();
			Session.set(getSearchStrKey.call(this),searchStr)
		}
		if(e.which === 27)//esc
		{
			e.preventDefault();
			Session.set(getSearchStrKey.call(this),"")
		}
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		var newUserLevel = Meteor.user().level === Permissions.level.publisher ? Permissions.level.journal:this.level;
		var query={query:"level="+newUserLevel};
		if(this.scope && this.scope.institutionId)
			query.query=query.query+ "&institutionId="+this.scope.institutionId;
		if(this.scope && this.scope.publisherId)
			query.query=query.query+ "&publisherId="+this.scope.publisherId;
		Router.go(Router.current().route.getName() + ".insert", {insId: Router.current().params.insId, pubId: Router.current().params.pubId},query);
	}
})
