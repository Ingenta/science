
Template.toggleField.helpers({
    notEmptyField:function(){
        return !_.isEmpty(this.field) && (this.field.cn || this.field.en);
    },
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
Template.toggleField.events({
    'hide.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-minus").addClass("fa-plus");
    },
    'show.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-plus").addClass("fa-minus");
    }
})

Template.toggleFieldBrowse.helpers({
    notEmptyField:function(){
        return !_.isEmpty(this.field) && (this.field.cn || this.field.en);
    },
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

Template.toggleFieldBrowse.events({
    'hide.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-minus").addClass("fa-plus");
    },
    'show.bs.collapse .collapse':function(e,t){
        e.stopPropagation();
        $(e.currentTarget).siblings('p').find("i").removeClass("fa-plus").addClass("fa-minus");
    }
})

Template.sendEmails.helpers({
    getCurrentUrl: function () {
        return Config.rootUrl + "doi/" + Session.get("currentDoi");
    },
    getDoi: function () {
        return Session.get("currentDoi");
    },
    getEmail:function(){
        var userInfo = Meteor.user();
        if(!userInfo || _.isEmpty(userInfo.emails)) return;
        return userInfo.emails[0].address;
    }
});

AutoForm.addHooks(['sendEmailsModalForm'], {
    onSuccess: function () {
        $("#sendEmailModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        var currentDoi = Session.get("currentDoi");
        var article = Articles.findOne({doi: currentDoi});
        if (!article)return;
        Meteor.call("insertAudit", Meteor.userId(), "emailThis", article.publisher, article.journalId, article._id, function (err, response) {
            if (err) console.log(err);
        });
    }
});