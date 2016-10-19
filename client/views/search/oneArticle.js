Template.oneArticle.helpers({
	"query": function () {
		return Router.current().params.searchQuery;
	},
	"contentType": function(){
		var articleType = ContentType.findOne({subject:this.contentType});
		if(articleType){
			return TAPi18n.getLanguage()=='zh-CN'?articleType.name.cn:articleType.name.en;
		}
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