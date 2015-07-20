Template.addArticleForCollection.helpers({
	collInfo:function(){
		return ArticleCollections.findOne({_id:Router.current().params.collId});
	}
})