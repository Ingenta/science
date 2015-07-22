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
		sweetAlert({
			title             : TAPi18n.__("Warning"),
			text              : TAPi18n.__("Confirm_delete"),
			type              : "warning",
			showCancelButton  : true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText : TAPi18n.__("Do_it"),
			cancelButtonText  : TAPi18n.__("Cancel"),
			closeOnConfirm    : false
		}, function () {
			var addedArticles = Session.get("addedArticles");
			var withOutThis = _.without(addedArticles,articleId);
			ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: withOutThis}});
			sweetAlert( TAPi18n.__("Deleted"),TAPi18n.__("Operation_success"), "success");
		});

	}
});