Template.oneArticle.helpers({
	"query": function () {
		return Router.current().params.searchQuery;
	},
	"contentType": function(){
		var articleType = ContentType.findOne({subject:this.contentType});
		if(articleType){
			return TAPi18n.getLanguage()=='zh-CN'?articleType.name.cn:articleType.name.en;
		}
	},
	"splLink": function(name){
		var journalId = Session.get("currentJournalId");
		if (!journalId)return;
		var journalPart = getJournalComponentByJournalId(journalId);
		if (!journalPart)return;
		var qureyArr = [];
		qureyArr.push({'title.en': name});
		qureyArr.push({'title.cn': name});
		var symposium = SpecialTopics.findOne({$or: qureyArr});
		if (!symposium)return;
		return journalPart + "/specialTopics/postArticles/" + symposium._id;
	}
});

Template.oneArticle.events({
	"click .btn-delete-article": function (e) {
		var articleId = this._id;
		confirmDelete(e,function(){
			Meteor.call("removeArticle",doi,function(e,r){
				e && sweetAlert("Error","删除文章失败");
			})
		});
	}
})