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
	"click .addSelectedArtcileToCollection": function (e) {
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


Template.oneArticleOfResult.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	getFullName: function () {
		if (TAPi18n.getLanguage() === "zh-CN")
			return this.surname.cn + ' ' + this.given.cn;
		return this.surname.en + ' ' + this.given.en;
	}
});