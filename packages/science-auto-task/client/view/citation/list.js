Template.citationTaskList.helpers({
	tasks:function(){
		return AutoTasks.find({type:"update_citation"},{sort:{createOn:-1}});
	},
	i18nStatus:function(){
		return TAPi18n.__("TaskStatus."+this.status);
	}
})