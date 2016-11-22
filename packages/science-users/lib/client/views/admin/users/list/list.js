var pageSession = new ReactiveDict();

pageSession.set("errorMessage", "");

var userPaginations = {
	"admin":new Paginator(Users),
	"normal":new Paginator(Users),
	"publisher":new Paginator(Users),
	"institution":new Paginator(Users)
}
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
		_.extend(query,{$or:[{username:{$regex:searchStr, $options: "i"}},{"emails.address":{$regex:searchStr}}]});
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
		var numPerPage = Session.get('PerPage') || 10;
		return userPaginations[this.level].find(query,{itemsPerPage: numPerPage})
	},
	"usersCount": function() {
		var searchStr = Session.get(getSearchStrKey.call(this));
		var query = getQuery.call(this,searchStr);
		return Meteor.users.find(query).count()>10;
	}
});

Template.AdminUsersViewTableItems.events({
	"click .modifyUser": function(e) {
		e.preventDefault();
		if (!Permissions.userCan("modify-user","user",Meteor.userId(),this.level)){
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
	"click .changeLevel": function(e) {
		e.preventDefault();
		pageSession.set("newUserLevel",null);
		if (!Permissions.userCan("modify-user","user",Meteor.userId(),this.level)){
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
		pageSession.set("userInfoForChangeLevel",this);
		$("#updateUserLevelFormModal").modal('show');
	},
	"click .resetUserPass": function() {
		if (!Permissions.userCan("modify-user","user",Meteor.userId(),this.level)){
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
		var user=this;
		sweetAlert({
			title             : TAPi18n.__("Are you sure?"),
			text              : TAPi18n.__("The user name")+': '+'<span style="color:red"><b>'+user.username+'</b></span>'+' '+TAPi18n.__("Password reset to")+": <b>123456</b>",
			type              : "warning",
			showCancelButton  : true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText : TAPi18n.__("OK"),
			cancelButtonText  : TAPi18n.__("Cancel"),
			closeOnConfirm    : true,
			html              : true
		}, function () {
			var default_password = "123456";
			Meteor.call("changeUsersPass", user._id, default_password, function (err) {
				if (err) {
					pageSession.set("errorMessage", err.reason);
				}
				else {
					sweetAlert({
						title: TAPi18n.__("Password reset"),
						type : "success",
						timer: 3000
					});
				}
			});
			return false;
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
	},
	"canModify":function(){
		return Permissions.userCan("modify-user","user",Meteor.userId(),{level:this.level}) && (this._id !== Meteor.userId()); //用户不可以在用户管理页中修改自己的信息
	},
	errorMessage: function () {
		return pageSession.get("errorMessage");
	},
	isEnrollAccount: function () {
		if (window.location.href.indexOf("enroll-account")!==-1)return true;
		return false;
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
	isInstitutionTab: function(){
		if(this.level == "institution")return;
		return true;
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

Template.updateUserLevelForm.helpers({
	"userInfo":function(){
		return pageSession.get("userInfoForChangeLevel")
	},
	"levelsWithoutCurrentOne":function(){
		var userlevel=this.level;
		var levels=[
			{label: TAPi18n.__("level.admin"), value: "admin"},
			{label: TAPi18n.__("level.publisher"), value: "publisher"},
			{label: TAPi18n.__("level.institution"), value: "institution"},
			{label: TAPi18n.__("level.normal"), value: "normal"}
		]
		return _.filter(levels,function(level){
			return level.value!=userlevel;
		})
	}
})

Template.updateUserLevelForm.events({
	"click label.btn":function(e){
		pageSession.set("newUserLevel",this.value);
	},
	"click #submitChangeLevel":function(){
		var userInfo=pageSession.get("userInfoForChangeLevel");
		var newlevel=pageSession.get("newUserLevel");
		if(!newlevel){
			sweetAlert({
				title: "错误",
				text: "请选择一个用户级别",
				type: "error",
				showCancelButton  : false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText : TAPi18n.__("OK"),
				closeOnConfirm    : true
			})
			return;
		}
		if(!userInfo || !userInfo._id){
			sweetAlert({
				title: "错误",
				text: "未取得用户信息",
				type: "error",
				showCancelButton  : false,
				confirmButtonColor: "#DD6B55",
				confirmButtonText : TAPi18n.__("OK"),
				closeOnConfirm    : true
			})
			return;
		}
		Science.dom.confirm(TAPi18n.__("confirmTitle"),TAPi18n.__("confirmChangeUserLevel"),function(){
			if(userInfo && newlevel){
				Meteor.call("changeUserLevel",userInfo._id,newlevel,function(e,r){
					if(r)
						FlashMessages.sendSuccess(TAPi18n.__("Operation_success"));
					else
						FlashMessages.sendError(TAPi18n.__("Failed"));
				})
				$("#updateUserLevelFormModal").modal('hide');
			}
		})
	}
})