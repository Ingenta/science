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
	showAccessKey:function(){
		return true;
	},
	showEmailThis:function(){
		return !!Router.current().params.articleDoi;
	}
});
Template.LayoutSideBar.events({
	'click .emailThis': function(){
		console.log("Hi, I want to share this article with you. "+Router.current().url);
	}
});