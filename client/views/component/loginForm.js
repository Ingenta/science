Template.loginForm.rendered = function () {
	$(".js-example-basic-single").select2();
	$("#login-form-journal").on("select2:select", function (e) {
		var id = e.params.data.id;
		var journal = Publications.findOne({_id:id});
		if(journal){
			Session.set("pubValue", journal.submissionReview);
		}
	});
};

Template.loginForm.helpers({
	publicationsList:function(){
		return Publications.find({visible:"1",submissionReview: {$exists: true}});
	},
	loginUrl: function(){
		var code = Session.get("pubValue");
		if(code)return code;
		window.close();
	}
	//loginUrl: function(){
	//	var pageCode = Session.get("pubValue");
	//	var lang = Session.get("Language");
	//	if (lang == "1") return Config.otherPlatformLoginUrl.scholarone+pageCode;
	//	return Config.otherPlatformLoginUrl.editors+pageCode;
	//},
	//registerUrl: function(){
	//	var pageCode = Session.get("pubValue");
	//	var lang = Session.get("Language");
	//	if (lang == "1")return Config.otherPlatformLoginUrl.scholarone+pageCode;
	//	return Config.otherPlatformRegisterUrl.editors;
	//},
	//isDisplayLogin: function(){
	//	var lang = Session.get("Language");
	//	if (lang == "2") return true;
	//}
});

Template.otherPlatformloginButtons.helpers({
	urlSubmission: function(){
		var journalId;
		if (Router.current() && Router.current().route.getName()) {
			if (Router.current().route.getName() === "journal.name" || Router.current().route.getName() === "journal.name.toc")
				journalId = Router.current().data()._id;
			if (Router.current().route.getName() === "article.show" || Router.current().route.getName() === "article.show.strange")
				journalId = Router.current().data().journalId;
		}
		var journal = Publications.findOne({_id:journalId});
		if(journal)return journal.submissionReview;
	},
	hideUrl: function(){
		var journalId;
		if (Router.current() && Router.current().route.getName() && Router.current().data && Router.current().data()) {
			if (Router.current().route.getName() === "journal.name" || Router.current().route.getName() === "journal.name.toc")
				journalId = Router.current().data()._id;
			if (Router.current().route.getName() === "article.show" || Router.current().route.getName() === "article.show.strange")
				journalId = Router.current().data().journalId;
		}
		if(journalId===undefined)return true;
	}
});