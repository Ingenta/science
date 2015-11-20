Template.loginForm.rendered = function () {
	AutoCompletion.init("input#login-form-journal");
}

Template.loginForm.events({
	'keyup input#login-form-journal': function () {
		var name =  (TAPi18n.getLanguage() === "en")?"title":"titleCn";
		AutoCompletion.autocomplete({
			element: 'input#login-form-journal',
			collection: Publications,
			field: name,
			limit: 10
		});
	},
	'mousedown .btn':function (){
			var title = $("#login-form-journal").val();
			var code="";
			if (TAPi18n.getLanguage() === "en"){
				var publications = Publications.findOne({title:title});
				if(publications){
					code = publications.scholarOneCode;
				}
			}else{
				var publications = Publications.findOne({titleCn:title});
				if(publications){
					code = publications.magtechCode;
				}
			}
			Session.set("pubValue", code);
	}
});

Template.loginForm.helpers({
	loginUrl:function(){
		var pageCode = Session.get("pubValue");
		if(pageCode===undefined){
			if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone;
			return Config.otherPlatformLoginUrl.editors;
		}else{
			if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone+pageCode;
			return Config.otherPlatformLoginUrl.editors+pageCode;
		}
	},
	registerUrl: function(){
		var pageCode = Session.get("pubValue");
		if(pageCode===undefined){
			if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone;
			return Config.otherPlatformRegisterUrl.editors;
		}else{
			if (TAPi18n.getLanguage() === "en")return Config.otherPlatformLoginUrl.scholarone+pageCode;
			return Config.otherPlatformRegisterUrl.editors;
		}
	},
	isDisplayLogin: function(){
		if (TAPi18n.getLanguage() === "zh-CN") return true;
	}
});

Template.otherPlatformloginButtons.helpers({
	displayIl8n: function(){
		if (TAPi18n.getLanguage() === "en") return true;
	}
});