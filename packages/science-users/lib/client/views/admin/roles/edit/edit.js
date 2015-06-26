var pageSession = new ReactiveDict();

Template.AdminRoleEdit.rendered = function() {

};

Template.AdminRoleEdit.events({

});

Template.AdminRoleEdit.helpers({

});

Template.AdminRolesEditForm.rendered = function() {


    pageSession.set("adminRolesEditFormInfoMessage", "");
    pageSession.set("adminRolesEditFormErrorMessage", "");

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

Template.AdminRolesEditForm.events({
    "submit": function(e, t) {
        e.preventDefault();
        pageSession.set("adminRolesEditFormInfoMessage", "");
        pageSession.set("adminRolesEditFormErrorMessage", "");

        var self = this;

        function submitAction(msg) {
            var adminRolesEditFormMode = "update";
            if(!t.find("#form-cancel-button")) {
                switch(adminRolesInsertInsertFormMode) {
                    case "insert": {
                        $(e.target)[0].reset();
                    }; break;

                    case "update": {
                        var message = msg || "Saved.";
                        pageSession.set("adminRolesEditFormInfoMessage", message);
                    }; break;

                }
            }

            Router.go("admin.roles", {});
        }

        function errorAction(msg) {
            var message = msg || "Error.";
            pageSession.set("adminRolesEditFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function(fieldName, fieldValue) {

            },
            function(msg) {

            },
            function(values) {
                Meteor.call("updateRole", t.data.admin_role._id, values, function(e) { if(e) errorAction(e.message); else submitAction(); });
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

Template.AdminRolesEditForm.helpers({
    "infoMessage": function() {
        return pageSession.get("adminRolesEditFormInfoMessage");
    },
    "errorMessage": function() {
        return pageSession.get("adminRolesEditFormErrorMessage");
    }

});
