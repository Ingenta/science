Template.AdminEmail.helpers({
    emailConfigurations: function () {
        return EmailConfig.find();
    }
});