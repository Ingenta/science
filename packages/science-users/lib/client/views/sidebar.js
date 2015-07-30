Template.LayoutSideBar.helpers({
	institutionLogo: function () {
		var currentUserIPNumber = Session.get("currentUserIPNumber");
		if(currentUserIPNumber === undefined){
			currentUserIPNumber = 0;
			Meteor.call("getClientIP", function (err, ip) {
				var arr = ip.split('.');
				arr.reverse().forEach(function (a, index) {
					currentUserIPNumber += (a*(Math.pow(256,index)));
				});
				Session.set("currentUserIPNumber", currentUserIPNumber);
			});
		}
		return currentUserIPNumber;
	},
	canUseAdminPanel:function(){
		return !!Permissions.getUserRoles().length;
	},
	advertisements: function () {
		return Advertisement.find({types: "1"});
	},
	advertisement: function () {
		return Advertisement.find({types: "2"});
	}
})