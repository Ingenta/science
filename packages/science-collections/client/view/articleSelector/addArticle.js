Template.addArticleForCollection.helpers({
	collInfo: function () {
		var coll = ArticleCollections.findOne({_id: Router.current().params.collId});
		Session.set("publisherId", coll.publisherId);
		Session.set("addedArticles", coll.articles ? coll.articles : []);
		return coll;
	}

});