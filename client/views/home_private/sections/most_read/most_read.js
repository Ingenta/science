Template.mostReadArticleList.helpers({
    mostReadArticlesTopFive: function () {
        var journalId;
        if (Router.current().route.getName() === "journal.name" || Router.current().route.getName() === "journal.name.volume")
            journalId = Router.current().data()._id;
        if (Router.current().route.getName() === "article.show")
            journalId = Router.current().data().journalId;
        Meteor.call("getMostRead", journalId, function (err, result) {
            Session.set("mostRead", result);
        });

        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];

        var suggestion = getMostReadSuggestion(journalId);
        if (suggestion)mostReadArticles.push(suggestion);
        most.forEach(function (item) {
            //if this item equals suggestion then skip it
            if (!suggestion || item._id.articleId !== suggestion._id) {
                var article = Articles.findOne({_id: item._id.articleId});
                article && mostReadArticles.push(article);
            }
        });
        return _.first(mostReadArticles, 5);
    },
    mostReadCount: function () {
        if (Session.get("mostRead") && 5 < Session.get("mostRead").length)return true;
        return false;
    }
});