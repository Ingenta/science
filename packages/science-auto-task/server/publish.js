Meteor.publish('queues',function(){
	if (this.userId) {
		return Queue.find();
	} else {
		return null;
	}
});