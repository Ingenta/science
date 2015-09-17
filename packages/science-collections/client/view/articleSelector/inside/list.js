Template.articlesInCollection.helpers({
	articles:function() {
		var addedArticles = Session.get("addedArticles");
		if (!addedArticles || !addedArticles.length)
			return [];

		return Articles.find({_id:{$in:addedArticles}});
	}
})

Template.singleArticleInColl.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	getFullName: function () {
		if (TAPi18n.getLanguage() === "zh-CN")
			return this.surname.cn + ' ' + this.given.cn;
		return this.surname.en + ' ' + this.given.en;
	}
})

Template.singleArticleInColl.events({
	"click button.btn-danger":function(e){
		e.preventDefault();
		var articleId = this._id;
		confirmDelete(e,function(){
			var addedArticles = Session.get("addedArticles");
			var withOutThis = _.without(addedArticles,articleId);
			ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: withOutThis}});
		})
	}
});