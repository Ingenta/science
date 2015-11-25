
Template.singleRoleForDelegate.helpers({

	"isPublisherRole":function(){
		return _.contains(this.level,Permissions.level.publisher);
	},
	"isJournalRole":function(){
		return _.contains(this.level,Permissions.level.journal);
	},
	"isInstitutionRole":function(){
		return _.contains(this.level,Permissions.level.institution);
	},
	"isNotGlobalRole": function () {
		//若角色的可用级别仅限于超级管理员,则该角色是不受范围限制的角色.
		return !(this.level.length == 1 && this.level[0] === OrbitPermissions.level.admin)
	},
	"clearStrForSel" : function (str) {
		return str && str.replace(/:/g, '-') || str;
	}
})

Template.singleRoleForDelegate.events({
	'click a.coll-trigger': function (e) {
		e.preventDefault();
		var tgt = $(e.target).data().target;
		$(tgt).collapse('toggle')
	}
})

Template.publisherForDelegate.helpers({
	"publishers": function () {
		return Publishers.find();
	}
})

Template.journalForDelegate.helpers({
	"journals": function(){
		return Publications.find();
	}
})

Template.institutionForDelegate.helpers({
	"institutions":function(){
		return Institutions.find();
	}
})

Template.publisherForDelegate.onRendered(function () {
	var p = Template.instance().$(".delegate-publisher").select2({
		placeholder: "请选择出版商"
	});
	var data = Template.currentData();
	if (_.isEmpty(data.userRoles)) {
		p.val(null).trigger('change');
		return;
	}

	var match = _.find(data.userRoles, function (role) {
		return role === data.code || role.role === data.code;
	})
	if (!match) {
		p.val(null).trigger('change');
		return;
	};
	if(typeof match ==='string'){
		p.val([match]).trigger('change');
		return;
	}

	var ur = match.scope.publisher || null;
	p.val(ur).trigger('change');
	return;
})

Template.journalForDelegate.onRendered(function () {
	var p = Template.instance().$(".delegate-journal").select2({
		placeholder: "请选择期刊"
	});
	var data = Template.currentData();
	if (_.isEmpty(data.userRoles)) {
		p.val(null).trigger('change');
		return;
	}

	var match = _.find(data.userRoles, function (role) {
		return role === data.code || role.role === data.code;
	})
	if (!match) {
		p.val(null).trigger('change');
		return;
	};
	if(typeof match ==='string'){
		p.val([match]).trigger('change');
		return;
	}

	var ur = match.scope.journal || null;
	p.val(ur).trigger('change');
	return;
})

Template.institutionForDelegate.onRendered(function () {
	var p = Template.instance().$(".delegate-institution").select2({
		placeholder: "请选择机构"
	});
	var data = Template.currentData();
	if (_.isEmpty(data.userRoles)) {
		p.val(null).trigger('change');
		return;
	}

	var match = _.find(data.userRoles, function (role) {
		return role === data.code || role.role === data.code;
	})
	if (!match) {
		p.val(null).trigger('change');
		return;
	};
	if(typeof match ==='string'){
		p.val([match]).trigger('change');
		return;
	}

	var ur = match.scope.institution || null;
	p.val(ur).trigger('change');
	return;
})