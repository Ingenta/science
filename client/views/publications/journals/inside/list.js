Template.articlesInSpecialTopics.helpers({
    articles: function () {
        var currentTopic = Router.current().params.specialTopicsId;
        if (currentTopic)
            return Articles.find({specialTopics: currentTopic});
    }
})

Template.singleArticleInSpecialTopics.events({
    "click button.btn-danger": function (e) {
        e.preventDefault();
        var that=this;
        var topicsId = Router.current().params.specialTopicsId;
        confirmDelete(e,function(){
            var withOutThis = _.without(that.specialTopics, topicsId);
            Articles.update({_id: that._id}, {$set: {specialTopics: withOutThis}});
        });
    }
});