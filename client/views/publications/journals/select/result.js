Template.searchResultForAddToSpecialTopics.helpers({
	articles: function () {
		return Articles.find();
	}
});


Template.searchResultForAddToSpecialTopics.events({
	"click .addSelectedArticleToCollection": function (e) {
		e.preventDefault();
        var newest      = [];
        $("input.articleCkd:checked").each(function (index, item) {
            newest.push($(item).val());
        });
        var addedArticles = Session.get("addedArticles");
        newest          = _.union(newest, addedArticles);
        SpecialTopics.update({_id: Router.current().params.specialTopicsId}, {$set: {articles: newest}});
	}
});


Template.oneArticleOfResultSpecialTopics.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	getFullName: function () {
		if (TAPi18n.getLanguage() === "zh-CN")
			return this.surname.cn + ' ' + this.given.cn;
		return this.surname.en + ' ' + this.given.en;
	},
    isSelected: function () {
        return _.contains(this.specialTopics, Router.current().params.specialTopicsId);
    }
});