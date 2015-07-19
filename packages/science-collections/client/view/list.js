Template.collectionsList.helpers({
	collections:function(){
		return ArticleCollections.find();
	}
})