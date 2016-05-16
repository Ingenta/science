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

AutoForm.addHooks(['broadcastEmailsModalForm'], {
    formToDoc:function(doc){
        if(_.isEmpty(doc.recipient) && _.isEmpty(doc.userLevel)){
            sweetAlert("您还没有设置接收邮件的接收者");
            return;
        }
        return doc;
    },
    onSuccess: function () {
        $("#broadcastEmailModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
});