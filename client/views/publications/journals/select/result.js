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
        var addedArticles = Session.get("addedArticles");
        newest          = _.union(newest, addedArticles);
        SpecialTopics.update({_id: Router.current().params.specialTopicsId}, {$set: {articles: newest}});
	}
});


Template.oneArticleOfResultSpecialTopics.helpers({
    isSelected: function () {
        return _.contains(this.specialTopics, Router.current().params.specialTopicsId);
    }
});