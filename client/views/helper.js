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
        var datetime = new Date();
        var dateCode = datetime.getUTCFullYear()*100+(datetime.getUTCMonth()+1);
        Meteor.call("getClientIP", Meteor.userId(), function (err, session) {
            var user = Users.findOne({_id: Meteor.userId()});
            PageViews.insert({
                articleId: article._id,
                userId: Meteor.userId(),
                institutionId:user.institutionId,
                journalId: article.journalId,
                publisher: article.publisher,
                when: datetime,
                dateCode: dateCode,
                action: "emailThis",
                ip: session
            });
        });
    }
});