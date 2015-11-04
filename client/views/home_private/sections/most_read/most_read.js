Template.mostReadArticleList.helpers({
    mostReadArticles: function () {
        if (!Session.get("mostRead")) {
            Meteor.call("getMostRead", Meteor.userId(), this.journalId, function (err, result) {
                Session.set("mostRead", result);
            });
        }
        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        var suggestedArticle = SuggestedArticles.findOne();
        if(suggestedArticle&&!this.journalId)
        {
            var article = Articles.findOne({_id: suggestedArticle.articleId});
            article && mostReadArticles.push(article);
        }
        most.forEach(function (item) {
            if (!suggestedArticle || item._id.articleId !== suggestedArticle.articleId) {
                var article = Articles.findOne({_id: item._id.articleId});
                article && mostReadArticles.push(article);
            }
        });
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