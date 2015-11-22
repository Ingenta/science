Template.mostReadArticleList.helpers({
    mostReadArticlesTopFive: function () {
        var journalId;
        if (Router.current() && Router.current().route.getName()) {
            if (Router.current().route.getName() === "journal.name" || Router.current().route.getName() === "journal.name.toc")
                journalId = Router.current().data()._id;
            if (Router.current().route.getName() === "article.show")
                journalId = Router.current().data().journalId;
        }
        Meteor.call("getMostRead", journalId, 5, function (err, result) {
            Session.set("mostReadIds", result);
        });
        var mostReadArticleIdList = Session.get("mostReadIds");
        return _.map(mostReadArticleIdList, function (id) {
            return Articles.findOne({_id: id})
        });
        ;
    },
    hasFiveOrMoreMostReadArticles: function () {
        if (Session.get("mostReadIds") && Session.get("mostReadIds").length >= 5)return true;
        return false;
    }
});