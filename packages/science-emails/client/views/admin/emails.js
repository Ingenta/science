Template.AdminEmail.helpers({
    emailConfigurations: function () {
        return EmailConfig.find();
    }
});

AutoForm.addHooks(['test123'], {
    onSuccess: function () {
        $("#jkafModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
});