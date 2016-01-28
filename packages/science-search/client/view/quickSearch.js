Template.quickSearchTemplate.helpers({
    journals: function () {
        return Publications.find({}, {field: {title: 1, titleCn: 1}});
    },
    isJournalPage: function () {
        if (!Router.current().route)return false;
        var currRoute = Router.current().route.getName();
        return _.contains(['journal.name', 'journal.name.toc', 'article.show','article.show.strange', 'guidelines.show'], currRoute);
    },
    journal: function () {
        var jourId = Session.get('currentJournalId');
        var journal = Publications.findOne({_id: jourId}, {field: {title: 1, titleCn: 1}});
        return journal;
    }
});

Template.quickSearchTemplate.events({
    'click .quick-search': function (e) {
        e.stopPropagation();
    },
    'click .qs-submit': function (e) {
        e.preventDefault();
        var journalId = Template.instance().$('.qs-journal').val() || Template.instance().$('.qs-journal-hidden').val();
        var volume = Template.instance().$('.qs-volume').val();
        var issue = Template.instance().$('.qs-issue').val();
        var page = Template.instance().$('.qs-page').val();
        var query = {filterQuery: {}};
        if (journalId)
            query.filterQuery.journalId = [journalId];
        if (volume)
            query.filterQuery.volume = [volume];
        if (issue)
            query.filterQuery.issue = [issue];
        if (page)
            query.filterQuery.page = [page];
        Template.instance().$('.dropdown-toggle').dropdown('toggle');
        SolrQuery.search(query);
    }
});