Template.articlesInSpecialTopics.helpers({
    articles: function () {
        if(_.isEmpty(this.articles))
            return ;
        return Articles.find({_id: {$in: this.articles}}, {sort: {padPage: 1}});
    },
    scope:function(){
        return {journal:Router.current().data().journalId}
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

Template.singleArticleInSpecialTopics.helpers({
    scope:function(){
        return {journal:Router.current().data().journalId}
    }
})