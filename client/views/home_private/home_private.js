Template.SingleNews.rendered = function() {
	$('.NewsPicture img:gt(0)').hide();
};

Template.SingleNews.events({
	'mouseenter .SingleNews':function(){
		$('.NewsPicture img').hide();
		$('.NewsPicture #'+this._id).show();
	}
});

Template.NewsList.helpers({
	news: function () {
		return News.find();
	}
});

Template.deleteNewsModalForm.helpers({
	getPrompt: function () {
		return TAPi18n.__("Are you sure?");
	}
});

Template.SingleNews.helpers({
	hasNews: function (id) {
		return  News.find({"news": id}).count()===0;
	}
});

AutoForm.addHooks(['addNewsModalForm'], {
	onSuccess: function () {
		$("#addNewsModal").modal('hide');
		FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
	}
}, true);

AutoForm.addHooks(['cmForm'], {
	onSuccess: function () {
		FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
	}
}, true);