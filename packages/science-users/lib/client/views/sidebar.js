Template.LayoutSideBar.helpers({
	orgLogo: function () {
		var currentUserIPNumber = Session.get("currentUserIPNumber");
		if(currentUserIPNumber === undefined){
			currentUserIPNumber = 0;
			Meteor.call("getClientIP", function (err, ip) {
				var arr = ip.split('.');
				arr.reverse().forEach(function (a, index) {
					currentUserIPNumber += (a*(Math.pow(256,index)));
				});
				Session.set("currentUserIPNumber", ip + ' = ' + currentUserIPNumber);
			});
		}
		return Session.get("currentUserIPNumber");
	},
	canUseAdminPanel:function(){
		return !!Permissions.getUserRoles().length;
	}
})