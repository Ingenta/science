Meteor.publish(null, function() {                                              // 1
	return Permissions.userCan("get-users-roles","permissions",this.userId) ? Meteor.users.find({}, {fields: {name:1,profile: 1, orbit_roles: 1, emails: 1}}) : this.ready();
	//return Meteor.users.find({});
}); 