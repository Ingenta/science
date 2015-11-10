Template.searchResultForAddToSpecialTopics.helpers({
	articles: function () {
		return Articles.find();
	}
});


Template.searchResultForAddToSpecialTopics.events({
	"click .addSelectedArticleToCollection": function (e) {
		e.preventDefault();
        var newest      = [];
        $("input.articleCkd:checked").each(function (index, item) {
            newest.push($(item).val());
        });
        var addedArticles = Session.get("addedArticlesTo");
        newest          = _.union(newest, addedArticles);
        if(!SpecialTopics.articles){
            SpecialTopics.articles=[];
        }
        SpecialTopics.update({_id: Router.current().params.specialTopicsId}, {$set: {articles: newest}});
	}
});


Template.oneArticleOfResultSpecialTopics.helpers({
    isSelected: function () {
        var addedArticles = Session.get("addedArticlesTo");
        return _.contains(addedArticles, this._id);
    }
});