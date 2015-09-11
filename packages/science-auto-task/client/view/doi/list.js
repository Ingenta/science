Template.registerdoi.helpers({
	tasks:function(){
		return AutoTasks.find({type:"doi_register"},{sort:{createOn:-1}});
	},
	i18nStatus:function(){
		return TAPi18n.__("TaskStatus."+this.status);
	}
})