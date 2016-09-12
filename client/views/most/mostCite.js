Template.mostCitedArticleFullList.onCreated(function(){
    this.sortOrder = new ReactiveVar(0);
})
Template.mostCitedArticleFullList.events({
    'change input.datesort': function (event, template) {
        template.sortOrder.set(parseInt(event.target.value));
    }
});

Template.mostCitedArticleFullList.helpers({
    mostCitedArticles: function () {
        var citedAr = undefined;
        var journalId = Router.current().params.journalId;
        if (journalId) citedAr = MostCited.find({journalId: journalId}, {sort: {count: -1}}).fetch();
        else citedAr = MostCited.find({},{sort: {count: -1}}).fetch();
        // 获取更多Id
        var allId = _.pluck(citedAr, 'articleId');
        // 返回article信息，并排序
        var sort = {};
        if (Template.instance().sortOrder.get())
            sort = {published: Template.instance().sortOrder.get()};
        else
            sort = {citationCount: -1};
        return Articles.find({_id: {$in: allId}}, {sort: sort});
    },
    query: function () {
        return Router.current().params.searchQuery;
    }
});