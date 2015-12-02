Template.collDetailHeader.helpers({
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
})