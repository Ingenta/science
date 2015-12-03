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
});

Template.collDetail.helpers({
	permissionCheck: function (publisherId, journalId) {
		if (journalId) {
			return Permissions.userCan("add-article-to-journal-collection", 'collections', Meteor.userId(), {journal: journalId});
		} else {
			return Permissions.userCan("add-article-to-publisher-collection", 'collections', Meteor.userId(), {publisher: publisherId});
		}
	}
});