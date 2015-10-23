var pageSession = new ReactiveDict();

pageSession.set("errorMessage", "");

Template.Login.rendered = function() {
	if (Meteor.userId())Router.go("home");
	$("input[autofocus]").focus();
};

Template.Login.created = function() {
	pageSession.set("errorMessage", "");	
};

Template.Login.events({
	'submit #login_form' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var login_email = t.find('#login_email').value.trim();
		var login_password = t.find('#login_password').value;

		// check email
		//if(!isValidEmail(login_email))
		//{
		//	pageSession.set("errorMessage", "Please enter your e-mail address.");
		//	t.find('#login_email').focus();
		//	return false;
		//}
		if(login_email == ""){
			pageSession.set("errorMessage", "Please enter your e-mail address or username.");
			t.find('#login_email').focus();
			return false;
		}
		// check password
		if(login_password == "")
		{
			pageSession.set("errorMessage", "Please enter your password.");
			t.find('#login_email').focus();
			return false;
		}

		submit_button.button("loading");
		Meteor.loginWithPassword(login_email, login_password, function(err) {
			submit_button.button("reset");
			if (err)
			{
				pageSession.set("errorMessage", err);
				return false;
			}
			else{
				pageSession.set("errorMessage", "");
				Router.go("home",{});
			}
		});
		return false; 
	}
	
});

Template.Login.helpers({
	errorMessage: function() {
		var em = pageSession.get("errorMessage");
		if(em instanceof Object) {
			console.log(em);
			if (em.error == 401) {
				var i18msg = TAPi18n.__(em.reason);
				if (i18msg && i18msg !== em.reason) {
					return i18msg + " [" + em.error + "]";
				}
			} else if (em.error == 423) {
				var reason = $.parseJSON(em.reason);
				//sweetAlert && sweetAlert({title:"Account locked",text:TAPi18n.__("Lock message",reason.duration)});
				return TAPi18n.__("Lock message",reason.duration);
			}

			return em.message;
		}
		return pageSession.get("errorMessage");
	}
	
});
