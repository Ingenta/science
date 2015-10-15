Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });

        var most = Session.get("mostRead");
        if (!most)return;

        //TODO: figure out a better way to do this instead of calling the db for each id in the list
        var mostReadArticles = [];
        most.forEach(function (id) {
            var article = Articles.findOne({_id: id._id.articleId});
            article && mostReadArticles.push(article);
        });
        return _.first(mostReadArticles,[5]);
    },
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    query      : function () {
        return Router.current().params.searchQuery;
    }
});