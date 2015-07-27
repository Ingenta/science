Meteor.publish("institutions",function(){
	return Institutions.find();
});