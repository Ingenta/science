Template.articlesInCollection.helpers({
	articles:function() {
		var addedArticles = this.collInfo.articles;
		if (!addedArticles || !addedArticles.length)
			return [];
		var publisherId = this.collInfo.publisherId;
		var journalId = this.collInfo.journalId;
		var sort = {"published": Session.get("sort")};
		var articleList =  Articles.find({_id:{$in:addedArticles}},{sort: sort}).fetch();
		articleList.forEach(function (oneArticle) {	
			oneArticle.publisherIdFromColl = publisherId;
			oneArticle.journalIdFromColl = journalId;
		});
		return articleList;
	}
});

Template.singleArticleInColl.helpers({
	permissionCheck: function (publisherId, journalId) {
		if (journalId) {
			return Permissions.userCan("remove-article-from-journal-collection", 'collections', Meteor.userId(), {journal: journalId});
		} else {
			return Permissions.userCan("remove-article-from-publisher-collection", 'collections', Meteor.userId(), {publisher: publisherId});
		}
	}
});

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