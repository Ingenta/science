var pageSession = new ReactiveDict();

Template.UserSettingsUpdateInformation.rendered = function () {

};

Template.UserSettingsUpdateInformation.events({});

Template.UserSettingsUpdateInformation.helpers({});

Template.UserSettingsUpdateInformationForm.rendered = function () {


    pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
    pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");

    $("input[autofocus]").focus();
};

Template.UserSettingsUpdateInformationForm.events({
    "submit": function (e, t) {
        e.preventDefault();
        pageSession.set("userSettingsUpdateInformationFormInfoMessage", "");
        pageSession.set("userSettingsUpdateInformationFormErrorMessage", "");

        function submitAction(msg) {
            var userSettingsProfileEditFormMode = "update";
            if (!t.find("#form-cancel-button")) {
                switch (userSettingsProfileEditFormMode) {
                    case "insert":
                    {
                        $(e.target)[0].reset();
                    }
                        ;
                        break;

                    case "update":
                    {
                        var message = msg || "Saved.";
                        pageSession.set("userSettingsUpdateInformationFormInfoMessage", message);
                    }
                        ;
                        break;
                }
            }

            Router.go("user_settings.update_information", {});
        }

        function errorAction(msg) {
            var message = msg || "Error.";
            pageSession.set("userSettingsUpdateInformationFormErrorMessage", message);
        }

        validateForm(
            $(e.target),
            function (fieldName, fieldValue) {

            },
            function (msg) {

            },
            function (values) {

                //console.log(values);
                Meteor.call("updateUserAccount", t.data.current_user_data._id, values, function (e) {
                    if (e) errorAction(e.message); else submitAction();
                });
            }
        );

        return false;
    },
    "click #form-cancel-button": function (e, t) {
        e.preventDefault();


        /*CANCEL_REDIRECT*/
    },
    "click #form-close-button": function (e, t) {
        e.preventDefault();

        /*CLOSE_REDIRECT*/
    },
    "click #form-back-button": function (e, t) {
        e.preventDefault();

        /*BACK_REDIRECT*/
    },
    "click #checkAll1": function () {
        $("input[name='profile.publications']").prop("checked", $("#checkAll1").is(":checked"));
    },
    "click #checkAll2": function () {
        $("input[name='profile.topics']").prop("checked", $("#checkAll2").is(":checked"));
    },
    'click .btn-primary': function (e) {
        var str = document.getElementsByName("profile.publications");
        var ids = "";
        for (i = 0; i < str.length; i++) {
            if (str[i].checked) {
                ids += str[i].value + ",";
            }
        }
        $(e.target).prev().click();
    }
});

Template.UserSettingsUpdateInformationForm.helpers({
    "infoMessage": function () {
        return pageSession.get("userSettingsUpdateInformationFormInfoMessage");
    },
    "errorMessage": function () {
        return pageSession.get("userSettingsUpdateInformationFormErrorMessage");
    },
    publicationList: function () {
        return Publications.find();
    },
    topicList: function () {
        return Topics.find({"parentId": null});
    }
});