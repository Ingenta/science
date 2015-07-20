Template.oneArticle.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	getFullName: function () {
		if (TAPi18n.getLanguage() === "zh-CN")
			return this.surname.cn + ' ' + this.given.cn;
		return this.surname.en + ' ' + this.given.en;
	},
	query      : function () {
		return Router.current().params.searchQuery;
	}
});

Template.oneArticle.events({
	"click .btn-delete-article": function () {
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
			Articles.remove({_id:articleId});
			sweetAlert( TAPi18n.__("Deleted"),TAPi18n.__("Operation_success"), "success");
		});
	}
})