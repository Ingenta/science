Template.addArticleForCollection.helpers({
	collInfo: function () {
		var coll = ArticleCollections.findOne({_id: Router.current().params.collId});
		Session.set("publisherId", coll.publisherId);
		Session.set("addedArticles", coll.articles ? coll.articles : []);
		return coll;
	},
	publisherName:function(){
		var pub = Publishers.findOne(this.publisherId);
		if(pub){
			return TAPi18n.getLanguage()=='zh-CN'?pub.chinesename:pub.name;
		}
		return "not found";
	},
	articleCount:function(){
		if(this.articles){
			return this.articles.length;
		}
		return 0;
	}
});