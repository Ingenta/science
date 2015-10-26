Template.articlesInSpecialTopics.helpers({
    articles: function () {
        var currentTopic = Router.current().params.topicsId;
        if (currentTopic)
            return Articles.find({topic: currentTopic});
    }
})

Template.singleArticleInSpecialTopics.events({
    "click button.btn-danger": function (e) {
        e.preventDefault();
        var that=this;
        var topicsId = Router.current().params.topicsId;
        confirmDelete(e,function(){
            var withOutThis = _.without(that.topic, topicsId);
            Articles.update({_id: that._id}, {$set: {topic: withOutThis}});
        });
    }
});