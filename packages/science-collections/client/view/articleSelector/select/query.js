Template.addArticleForCollection.events({
	"click .search-btn": function () {
		var qf = $(".queryField");
		var q = {};
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


Template.searchArticleForAddToCollection.helpers({
	journals: function () {
		return Publications.find({publisher: Session.get("publisherId")}, {title: 1});
	}
});