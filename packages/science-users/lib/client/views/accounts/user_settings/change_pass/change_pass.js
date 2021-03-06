var pageSession = new ReactiveDict();

pageSession.set("errorMessage", "");
pageSession.set("infoMessage", "");

Template.UserSettingsChangePass.rendered = function() {
	
	$("input[autofocus]").focus();
};

Template.UserSettingsChangePass.created = function() {
	pageSession.set("errorMessage", "");	
	pageSession.set("infoMessage", "");	
};

Template.UserSettingsChangePass.events({
	'submit #change_pass_form' : function(e, t) {
		e.preventDefault();

		pageSession.set("errorMessage", "");
		pageSession.set("infoMessage", "");

		var submit_button = $(t.find(":submit"));

		var old_password = t.find('#old_password').value;
		var new_password = t.find('#new_password').value;
		var confirm_pass = t.find('#confirm_pass').value;

		if(old_password == "")
		{
			pageSession.set("errorMessage", TAPi18n.__("OldPassword"));
			t.find('#old_password').focus();
			return false;
		}
		if(new_password == "")
		{
			pageSession.set("errorMessage", TAPi18n.__("NewPassword."));
			t.find('#new_password').focus();
			return false;
		}
		if(confirm_pass == "")
		{
			pageSession.set("errorMessage", TAPi18n.__("ConfirmNewPas"));
			t.find('#confirm_pass').focus();
			return false;
		}
		// check new password
		if(old_password == new_password)
		{
			pageSession.set("errorMessage",TAPi18n.__("SamePassword"));
			t.find('#new_password').focus();
			return false;
		}
		// check password length
		var min_password_len = 6;
		if (!isValidPassword(new_password, min_password_len)) {
			pageSession.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
			t.find('#new_password').focus();
			return false;
		}
		// check new password
		if(new_password != confirm_pass)
		{
			pageSession.set("errorMessage",TAPi18n.__("PasswordNotMatch"));
			t.find('#new_password').focus();
			return false;
		}

		submit_button.button("loading");
		Accounts.changePassword(old_password, new_password, function(err) {
			submit_button.button("reset");
			if (err) {
				pageSession.set("errorMessage", err.message);
				return false;
			} else {
				pageSession.set("errorMessage", "");
				pageSession.set("infoMessage", TAPi18n.__("Password reset"));
				t.find('#old_password').value = "";
				t.find('#new_password').value = "";
				t.find('#confirm_pass').value = "";
				t.find('#old_password').focus();
			}
		});
		return false; 
	}
});

Template.UserSettingsChangePass.helpers({
	errorMessage: function() {
		return pageSession.get("errorMessage");
	},
	infoMessage: function() {
		return pageSession.get("infoMessage");
	}
	
});
