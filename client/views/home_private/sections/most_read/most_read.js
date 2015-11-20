Template.mostReadArticleList.helpers({
    mostReadArticlesTopFive: function () {
        var journalId;
        if (Router.current().route.getName() && Router.current().data()) {
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
        });;
    },
    mostReadCount: function () {
        if (Session.get("mostRead") && 5 < Session.get("mostRead").length)return true;
        return false;
    }
});