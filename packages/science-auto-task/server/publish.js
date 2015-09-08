Meteor.publish('autoTasks',function(){
	if (this.userId) {
		return AutoTasks.find();
	} else {
		return null;
	}
});