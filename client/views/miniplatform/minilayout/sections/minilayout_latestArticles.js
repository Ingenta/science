Template.layoutLatestArticles.helpers({
    getArticles:function(){
        return Articles.findOne({publisher:Config.mainPublish});
    }
});

AutoForm.addHooks(['addNewsRecommendModalForm'], {
    onSuccess: function () {
        $("#addNewsRecommendModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);
