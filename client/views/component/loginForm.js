var targetPlatform = new ReactiveVar();

Template.loginForm.helpers({
	loginUrl:function(){
		var tp = targetPlatform.get();
		if(!tp) return;
		var url = Config.otherPlatformLoginUrl[tp];
		if(!url) return;
		return url + tp;
	}
})

Template.otherPlatformloginButtons.events({
	"click a":function(e){
		e.preventDefault();
		var target = $(e.target).data().target;
		targetPlatform.set(target);
		Modal.show(Template.loginForm);
	}
})