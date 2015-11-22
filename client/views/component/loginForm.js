Template.loginForm.rendered = function () {
	$(document).ready(function() {
		$(".js-example-basic-single").select2({
			placeholder: TAPi18n.__( "Please select more journal name")
		});
	});
};

Template.loginForm.events({
	'mousedown .btn':function (e,t){
		var code = t.find("#login-form-journal").value;
		Session.set("pubValue", code);
	}
});

Template.loginForm.helpers({
	publicationsList:function(){
		return Publications.find();
	},
	loginUrl: function(){
		var pageCode = Session.get("pubValue");
		if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone+pageCode;
		return Config.otherPlatformLoginUrl.editors+pageCode;
	},
	registerUrl: function(){
		var pageCode = Session.get("pubValue");
		if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone+pageCode;
		return Config.otherPlatformRegisterUrl.editors;
	},
	isDisplayLogin: function(){
		if (TAPi18n.getLanguage() === "zh-CN") return true;
	},
	codeValue:function(){
		if (TAPi18n.getLanguage() === "en")return this.scholarOneCode || " ";
		return this.magtechCode || " ";
	}
});

Template.otherPlatformloginButtons.helpers({
	displayIl8n: function(){
		if (TAPi18n.getLanguage() === "en") return true;
	}
});