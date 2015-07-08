Meteor.methods({
	"batchRevoke":function(roles){
		if(roles){
			var r;
			if(toString.apply(roles) !== '[object Array]'){
				r = [roles];
			}else if(roles.length){
				r=roles;
			}
			if(r)
				Meteor.users.update({},{$pullAll:{orbit_roles:r}}, {multi: true});
			return true;
		}
		return false;
	}
});
