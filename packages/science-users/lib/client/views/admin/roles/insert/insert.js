var pageSession = new ReactiveDict();

Template.AdminRolesInsert.rendered = function() {

};

Template.AdminRolesInsert.events({

});

Template.AdminRolesInsert.helpers({

});

Template.AdminRolesInsertInsertForm.rendered = function() {


	pageSession.set("adminRolesInsertInsertFormInfoMessage", "");
	pageSession.set("adminRolesInsertInsertFormErrorMessage", "");

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

Template.AdminRolesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminRolesInsertInsertFormInfoMessage", "");
		pageSession.set("adminRolesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminRolesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminRolesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminRolesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.users", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminRolesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				Meteor.call("createUserAccount", values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.users", {});
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

Template.AdminRolesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminRolesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminRolesInsertInsertFormErrorMessage");
	}

});
