Template.oneArticle.helpers({
	"query": function () {
		return Router.current().params.searchQuery;
	},
	"contentType": function(){
		return TAPi18n.__("contentType." + this.contentType).replace("contentType.","");
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