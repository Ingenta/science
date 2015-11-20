Template.sortByDateControl.events({
    'change input.datesort': function (event) {
        Session.set("sort", event.target.value);
    }
});
Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        var journalId = Router.current().params.journalId;

        // 获取更多Id
        Meteor.call("getMostRead", journalId, 20, function (err, result) {
            Session.set("mostReadIds", result);
        });
        var mostReadArticleIdList = Session.get("mostReadIds");
        // 返回article信息，并排序
        if (!Session.get("sort"))return _.map(mostReadArticleIdList, function (id) {
            return Articles.findOne({_id: id})
        })

        var sort = {"published": Session.get("sort")};
        return Articles.find({_id: {$in: allId}}, {sort: sort});

    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});
