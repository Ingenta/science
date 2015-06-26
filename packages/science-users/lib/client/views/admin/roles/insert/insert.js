var pageSession = new ReactiveDict();

Template.AdminRolesInsert.rendered = function() {

};

Template.AdminRolesInsert.events({

});

Template.AdminRolesInsert.helpers({

});

Template.AdminRolesInsertForm.rendered = function() {


	pageSession.set("adminRolesInsertFormInfoMessage", "");
	pageSession.set("adminRolesInsertFormErrorMessage", "");

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

Template.AdminRolesInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminRolesInsertFormInfoMessage", "");
		pageSession.set("adminRolesInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminRolesInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminRolesInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminRolesInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.roles", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("adminRolesInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {


				Meteor.call("createRole", values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();



		Router.go("admin.roles", {});
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

Template.AdminRolesInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminRolesInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminRolesInsertFormErrorMessage");
	}

});
