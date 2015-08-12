Template.articlesInTopics.helpers({
    articles: function () {
        var currentTopic = Router.current().params.topicsId;
        if (currentTopic)
            return Articles.find({topic: currentTopic});
    }
})

Template.singleArticleInTopics.helpers({
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    }
})

Template.singleArticleInTopics.events({
    "click button.btn-danger": function (e) {
        e.preventDefault();
        var that=this;
        var topicsId = Router.current().params.topicsId;
        sweetAlert({
            title: TAPi18n.__("Warning"),
            text: TAPi18n.__("Confirm_delete"),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: TAPi18n.__("Do_it"),
            cancelButtonText: TAPi18n.__("Cancel"),
            closeOnConfirm: false
        }, function () {
            var withOutThis = _.without(that.topic, topicsId);
            Articles.update({_id: that._id}, {$set: {topic: withOutThis}});
            sweetAlert({
                title: TAPi18n.__("Deleted"),
                text: TAPi18n.__("Operation_success"),
                type: "success",
                timer: 2000
            });
        });

    }
});