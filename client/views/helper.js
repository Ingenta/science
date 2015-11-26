Template.toggleField.helpers({
    getContent: function (field) {
        if (typeof field == "object") {
            if (TAPi18n.getLanguage() === "zh-CN") {
                if (!field.cn)return field.en;
                return field.cn;
            }
            if (!field.en)return field.cn;
            return field.en;
        } else {
            return field;
        }
    }
});

Template.sendEmails.helpers({
    getCurrentUrl: function () {
        return window.location.href;
    },
    getDoi: function () {
        return Session.get("currentDoi");
    }
});

AutoForm.addHooks(['sendEmailsModalForm'], {
    onSuccess: function () {
        $("#sendEmailModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        var currentDoi = Router.current().params.publisherDoi + "/" + Router.current().params.articleDoi;
        var article = Articles.findOne({doi: currentDoi});
        Meteor.call("grabSessions", Meteor.userId(), function (err, session) {
            PageViews.insert({
                articleId: article._id,
                userId: Meteor.userId(),
                journalId: article.journalId,
                when: new Date(),
                action: "emailThis",
                ip: session
            });
        });
    }
});