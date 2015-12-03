Template.articlesInCollection.helpers({
	articles:function() {
		var addedArticles = this.collInfo.articles;
		if (!addedArticles || !addedArticles.length)
			return [];
		return Articles.find({_id:{$in:addedArticles}});
	}
})

Template.singleArticleInColl.events({
	"click button.btn-danger":function(e){
		e.preventDefault();
		var articleId = this._id;
		confirmDelete(e,function(){
			var insideArticles = Router.current().data().collInfo.articles;
			var withOutThis = _.without(insideArticles,articleId);
			ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: withOutThis}});
		})
	}
});