Template.mostReadArticle.events({
    'click .datesort': function (event) {
        Session.set("sort", event.target.value);
    }
});

Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        if (!Session.get("mostRead")) {
            Meteor.call("getMostRead", Meteor.userId(), this.journalId, function (err, result) {
                Session.set("mostRead", result);
            });
        }
        var most = Session.get("mostRead");
        if (!most)return;
        // 获取更多Id
        var allId = [];
        var suggestedArticle = SuggestedArticles.findOne();
        if (suggestedArticle) {
            allId.push(suggestedArticle.articleId);
        }
        _.each(most, function (item) {
            if(suggestedArticle&&!this.journalId) {
                var article = Articles.findOne({_id: item._id.articleId});
                article && allId.push(item._id.articleId);
            }
        });
        console.log(allId)
        // 返回article信息，并排序
        if (!Session.get("sort"))return _.map(allId, function (id) {
            return Articles.findOne({_id: id})
        })

        var sort = {"published": Session.get("sort")};
        return Articles.find({_id: {$in: allId}}, {sort: sort});

    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});
