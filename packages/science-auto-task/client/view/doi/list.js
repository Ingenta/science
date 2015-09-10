Template.registerdoi.helpers({
	tasks:function(){
		return AutoTasks.find({type:"doi_register"},{sort:{createOn:-1}});
	}
})