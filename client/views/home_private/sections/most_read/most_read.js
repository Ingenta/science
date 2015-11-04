Template.mostReadArticleList.helpers({
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), this.journalId, function (err, result) {
            Session.set("mostRead", result);
        });
        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        var suggestedArticle = SuggestedArticles.findOne();
        most.forEach(function (id) {
            if (id._id.articleId !== suggestedArticle.articleId) {
                var article = Articles.findOne({_id: id._id.articleId});
                article && mostReadArticles.push(article);
            }
        });
        //get only the top 4 if there is a suggestion
        if (suggestedArticle)return _.first(mostReadArticles, [4]);
        return _.first(mostReadArticles, [5]);
    },
    mostReadCount: function () {
        var most = Session.get("mostRead");
        var allId = [];
        _.each(most, function (item) {
            allId.push(item._id.articleId);
        });
        if (5 < allId.length) {
            return true;
        } else {
            return false;
        }
    }
});