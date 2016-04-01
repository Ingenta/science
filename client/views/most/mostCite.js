Template.mostCitedArticleFullList.events({
    'change input.datesort': function (event) {
        Session.set("sort", parseInt(event.target.value));
    }
});

Template.mostCitedArticleFullList.helpers({
    mostCitedArticles: function () {
        var citedAr = undefined;
        var journalId = Router.current().params.journalId;
        if (journalId) citedAr = MostCited.find({journalId: journalId}).fetch();
        else citedAr = MostCited.find().fetch();
        // 获取更多Id
        var allId = _.pluck(citedAr, 'articleId');
        // 返回article信息，并排序
        var sort = {};
        if (Session.get("sort"))
            sort = {published: Session.get("sort")};
        else
            sort = {citationCount: -1};
        return Articles.find({_id: {$in: allId}}, {sort: sort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});