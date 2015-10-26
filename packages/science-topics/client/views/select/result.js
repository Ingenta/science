Template.searchResultForAddToTopics.helpers({
	articles: function () {
		var query = Session.get("query") ? Session.get("query") : {};
        query.topic={$not:Router.current().params.topicsId};
		return Articles.find(query);
	}
});


Template.searchResultForAddToTopics.events({
	"click .addSelectedArticleToCollection": function (e) {
		e.preventDefault();
        var topicsId = Router.current().params.topicsId;
		$("input.articleCkd:checked").each(function (index, item) {
           var a = Articles.findOne({_id : $(item).val()});
            a.topic.push(topicsId);
            Articles.update({_id : a._id},{$set : {topic: a.topic}});
		});
	}
});


Template.oneArticleOfResultTopics.helpers({
    isSelected: function () {
        return _.contains(this.topic, Router.current().params.topicsId);
    }
});