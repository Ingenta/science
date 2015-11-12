//var targetPlatform = new ReactiveVar();

Template.loginForm.events({
	'click #login-form-journal': function (e) {
		var code = $("#login-form-journal").val();
		Session.set('optionVal',code);
	}
});

Template.loginForm.helpers({
	publicationList:function(){
		return Publications.find();
	},
	loginUrl:function(){
		var pageCode = Session.get("optionVal");
		if (TAPi18n.getLanguage() === "en"){
			var url = Config.otherPlatformLoginUrl.scholarone;
			if(!url) return;
			return url+"/"+pageCode;
		}
		if(TAPi18n.getLanguage() === "zh-CN"){
			var url = Config.otherPlatformLoginUrl.editors;
			if(!url) return;
			return url+pageCode;
		}
	},
	registerUrl: function(){
		var pageCode = Session.get("optionVal");
		if (TAPi18n.getLanguage() === "en") return Config.otherPlatformLoginUrl.scholarone+"/"+pageCode;
		return Config.otherPlatformRegisterUrl.editors;
	},
	codeValue: function(){
		if (TAPi18n.getLanguage() === "en") return this.scholarOneCode;
		return this.magtechCode;
	},
	isChecked: function(){
		var iscn = TAPi18n.getLanguage() === 'zh-CN';
		var isJournalPage = _.contains(Config.displayJournalLogin.journal, Router.current().route.getName());
		if(isJournalPage){
			var journalId = Session.get('currentJournalId');
			var publications = Publications.findOne({_id:journalId});
			if(publications){
				var code = iscn ? publications.titleCn : publications.title;
				var code1 = iscn ? this.titleCn : this.title;
				if(code&&code1&&code==code1){
					var pagecode = iscn ? this.magtechCode : this.scholarOneCode;
					Session.set('optionVal',pagecode);
					return "selected";
				}
			}
		}
	}
});

Template.otherPlatformloginButtons.helpers({
	displayIl8n: function(){
		if (TAPi18n.getLanguage() === "en") return true;
	}
});

//Template.otherPlatformloginButtons.events({
//	"click a":function(e){
//		e.preventDefault();
//		var target = $(e.target).data().target;
//		targetPlatform.set(target);
//	}
//});