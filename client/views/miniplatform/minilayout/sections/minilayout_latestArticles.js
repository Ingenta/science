Template.layoutLatestArticles.helpers({
    getArticles:function(){
        return Articles.findOne({publisher:Config.mainPublish});
    }
});

Template.layoutLatestArticles.events({
    'click #pubDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:pid});
        })
    }
})

AutoForm.addHooks(['addNewsRecommendModalForm'], {
    onSuccess: function () {
        $("#addNewsRecommendModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);
