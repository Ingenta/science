var pageSession = new ReactiveDict();

Template.UserSettingsUpdateInformation.rendered = function() {
	
};

Template.UserSettingsUpdateInformation.events({
	
});

Template.UserSettingsUpdateInformation.helpers({
	
});

Template.UserSettingsUpdateInformationForm.rendered = function() {
	

	pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
	pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();			
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[autofocus]").focus();
};

Template.UserSettingsUpdateInformationForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
		pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");
		
		var self = this;

		function submitAction(msg) {
			var userSettingsProfileEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(userSettingsProfileEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("userSettingsUpdateInformationFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("user_settings.profile", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("userSettingsUpdateInformationFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("updateUserAccount", t.data.current_user_data._id, values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.UserSettingsUpdateInformationForm.helpers({
	"infoMessage": function() {
		return pageSession.get("userSettingsUpdateInformationFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("userSettingsUpdateInformationFormErrorMessage");
	}
	
});