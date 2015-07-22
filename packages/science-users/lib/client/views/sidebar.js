Template.LayoutSideBar.helpers({
	orgLogo: function () {
		var currentUserIPNumber = Session.get("currentUserIPNumber");
		if(currentUserIPNumber === undefined){
			currentUserIPNumber = 0;
			Meteor.call("getClientIP", function (err, ip) {
				//var arr = ip.split('.');
				//arr.reverse().forEach(function (a, index) {
				//	currentUserIPNumber += (a*(Math.pow(256,index)));
				//})
				console.log(ip);
				currentUserIPNumber = ip;
				Session.set("currentUserIPNumber", currentUserIPNumber);
			});
		}
		return currentUserIPNumber;
	},
	canUseAdminPanel:function(){
		return !!Permissions.getUserRoles().length;
	}
})