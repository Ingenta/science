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

Template.loginForm.events({
	'click .btn': function (event) {
		var inputValue = $("#login-form-journal").val();
		var journal = Publications.findOne({_id:inputValue});
		if(!journal){
			sweetAlert(TAPi18n.__("Please select a journal"));
			return false;
		}
	}
});

Template.loginForm.helpers({
	publicationsList:function(){
		return Publications.find({visible:"1",submissionReview: {$exists: true}});
	},
	loginUrl: function(){
		var code = Session.get("pubValue");
		if(code)return code;
	}
});

Template.otherPlatformloginButtons.helpers({
	urlSubmission: function(){
		var journalId;
		if (Router.current() && Router.current().route.getName()) {
			if (_.contains(["journal.name","journal.name.long"],Router.current().route.getName()))
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
			if (_.contains(["journal.name","journal.name.long"],Router.current().route.getName()))
				journalId = Router.current().data()._id;
			if (Router.current().route.getName() === "article.show" || Router.current().route.getName() === "article.show.strange")
				journalId = Router.current().data().journalId;
		}
		if(journalId===undefined)return true;
	}
});