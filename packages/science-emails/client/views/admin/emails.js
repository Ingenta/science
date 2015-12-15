Template.AdminEmail.helpers({
    emailConfigurations: function () {
        return EmailConfig.find();
    }
});

Template.updateEmailConfig.helpers({
    isAlert: function () {
        if (this.isAlert)return true;
        return false;
    }
});

AutoForm.addHooks(['test123'], {
    onSuccess: function () {
        $("#jkafModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
});