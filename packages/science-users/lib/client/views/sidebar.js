Template.LayoutSideBar.helpers({
	canUseAdminPanel:function(){
		return !!Permissions.getUserRoles().length;
	}
})