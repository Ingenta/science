Meteor.publish("allconnections",function(){
	return UserStatus.connections.find();
});