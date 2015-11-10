Template.articlesInSpecialTopics.helpers({
    articles: function () {
        var addedArticles = Session.get("addedArticlesTo");
        if (!addedArticles || !addedArticles.length)
            return [];

        return Articles.find({_id: {$in: addedArticles}});
    }
})

Template.singleArticleInSpecialTopics.events({
    "click button.btn-danger": function (e) {
        e.preventDefault();
        var articleId = this._id;
        confirmDelete(e,function(){
            var addedArticles = Session.get("addedArticlesTo");
            var withOutThis = _.without(addedArticles,articleId);
            SpecialTopics.update({_id: Router.current().params.specialTopicsId}, {$set: {articles: withOutThis}});
        });
    }
});