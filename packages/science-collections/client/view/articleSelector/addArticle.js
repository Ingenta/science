Template.addArticleForCollection.helpers({
	collInfo: function () {
		var coll = ArticleCollections.findOne({_id: Router.current().params.collId});
		Session.set("publisherId", coll.publisherId);
		Session.set("addedArticles", coll.articles ? coll.articles : []);
		return coll;
	}

});

Template.addArticleForCollection.events({
	"click .search-btn": function () {
		var qf = $(".queryField");
		_.each(qf, function (item) {
			var val = $(item).val();
			if (val) {
				var qfield                   = $(item).data().queryfield;
				val                          = qfield == 'title.en' ? {$regex: val, $options: "i"} : val;
				q[$(item).data().queryfield] = val;
			}
		});
		Session.set("query", q);
	}
});

Template.searchResultForAddToCollection.helpers({
	articles: function () {
		var query = Session.get("query") ? Session.get("query") : {};
		query.publisher=Session.get("publisherId");
		var aa = Session.get("addedArticles");
		if(aa && aa.length){
			query._id={$nin:aa};
		}
		console.log(query);
		return Articles.find(query);
	}
});


Template.searchResultForAddToCollection.events({
	"click .addSelectedArtcileToCollection": function (e) {
		e.preventDefault();
		var newest      = [];
		$("input.articleCkd:checked").each(function (index, item) {
			newest.push($(item).val());
		});
		var addedArticles = Session.get("addedArticles");
		newest          = _.union(newest, addedArticles);
		ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: newest}});
	}
})

Template.searchArticleForAddToCollection.helpers({
	journals: function () {
		return Publications.find({publisher: Session.get("publisherId")}, {title: 1});
	}
});

Template.oneArticleOfResult.helpers({
	journalName: function (id) {
		return Publications.findOne({_id: id}).title;
	},
	getFullName: function () {
		if (TAPi18n.getLanguage() === "zh-CN")
			return this.surname.cn + ' ' + this.given.cn;
		return this.surname.en + ' ' + this.given.en;
	}
});