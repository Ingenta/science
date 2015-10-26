Template.searchResultForAddToCollection.helpers({
	articles: function () {
		var query = Session.get("query") ? Session.get("query") : {};
		query.publisher=Session.get("publisherId");
		var aa = Session.get("addedArticles");
		if(aa && aa.length){
			query._id={$nin:aa};
		}
		return Articles.find(query);
	}
});


Template.searchResultForAddToCollection.events({
	"click .addSelectedArticleToCollection": function (e) {
		e.preventDefault();
		var newest      = [];
		$("input.articleCkd:checked").each(function (index, item) {
			newest.push($(item).val());
		});
		var addedArticles = Session.get("addedArticles");
		newest          = _.union(newest, addedArticles);
		ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: newest}});
	}
});