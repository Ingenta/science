Template.oneArticle.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	query      : function () {
		return Router.current().params.searchQuery;
	}
});

Template.oneArticle.events({
	"click .btn-delete-article": function (e) {
		var articleId = this._id;
		confirmDelete(e,function(){
			Articles.remove({_id:articleId});
		})
	}
})