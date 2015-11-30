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

Template.test2.helpers({
	s2opt:function(){
		return Session.get("option")
	}
})