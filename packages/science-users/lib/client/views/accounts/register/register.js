var pageSession = new ReactiveDict();

pageSession.set("errorMessage", "");

Template.Register.rendered = function () {
    if (Meteor.userId())Router.go("home");
    $("input[autofocus]").focus();
};

Template.Register.created = function () {
    pageSession.set("errorMessage", "");
};

Template.Register.events({
    'submit #register_form': function (e, t) {
        e.preventDefault();

        var submit_button = $(t.find(":submit"));

        var register_name = t.find('#register_name').value.trim();
        var register_email = t.find('#register_email').value.trim();
        var register_password = t.find('#register_password').value;

        // check name
        if (register_name == "") {
            pageSession.set("errorMessage", "Please enter your name.");
            t.find('#register_name').focus();
            return false;
        }

        // check email
        if (!isValidEmail(register_email)) {
            pageSession.set("errorMessage", TAPi18n.__("PleaseEmail"));
            t.find('#register_email').focus();
            return false;
        }

        // check password
        var min_password_len = 6;
        if (!isValidPassword(register_password, min_password_len)) {
            pageSession.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
            t.find('#register_password').focus();
            return false;
        }

        submit_button.button("loading");
        Meteor.call("registerUser", register_name, register_password, register_email, function (err) {
            submit_button.button("reset");
            if (err) {
                pageSession.set("errorMessage", err.reason);
            }
            else {
                pageSession.set("errorMessage", "");
                Router.go("home", {});
                sweetAlert(TAPi18n.__("CheckEmail"));
            }
        });
        return false;
    },
    'click #register_accept': function (e, t) {
        if (t.find('#register_accept').checked) {
            t.find('#register_submit').disabled = undefined;
        } else {
            t.find('#register_submit').disabled = "disabled";
        }
    }
});

Template.Register.helpers({
    errorMessage: function () {
        return pageSession.get("errorMessage");
    }

});
