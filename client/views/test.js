Router.route("test2",{
	path:"/test2",
	waitOn: function () {
		return [
			Meteor.subscribe("allEditableTemplate")
		]
	}
});

Meteor.startup(function(){

})
