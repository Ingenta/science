Router.route('/publisher/:publisherName/journal/:journalShortTitle', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (journal) {
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            if(this.params.query.vol && this.params.query.iss){
                var query={journalId:journal._id};
                query.volume=this.params.query.vol;
                query.issue=this.params.query.iss;
                var currentIssue = Issues.findOne(query);
                currentIssue && Session.set("currentIssueId",currentIssue._id);
                Session.set("activeTab", "Browse");
            } else {
                Session.set('currentIssueId', null);
                Science.setActiveTabByUrl(window.location.search, journal.tabSelections, "Overview");
            }
            return journal;
        }
    },
    template: "ShowJournal",
    title: function () {
        var p = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (!p)return ":journalShortTitle";
        if (TAPi18n.getLanguage() === "en")return p.title || p.titleCn;
        return p.titleCn || p.title;

    },
    parent: "publisher.name",
    name: "journal.name",
    waitOn: function () {
        if(this.params.query.slug=='Browse'){
            return [
                JournalSubs.subscribe('journalBrowseTabVolumeList', this.params.journalShortTitle),
                JournalSubs.subscribe('medias'),
                JournalSubs.subscribe('files'),
                JournalSubs.subscribe('tag')
            ]
        }else{
            return [
                JournalSubs.subscribe("journalOverviewTab", this.params.journalShortTitle),
                CollectionSubs.subscribe('allCollections'),
                JournalSubs.subscribe('medias'),
                JournalSubs.subscribe('files'),
                JournalSubs.subscribe('tag')
            ]
        }

    },
    onStop: function () {
        Science.dom.clearSelect2Record();
    }
});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/specialTopics/:specialTopicsId', {
    data: function () {
        return SpecialTopics.findOne({_id: this.params.specialTopicsId});
    },
    template: "addArticleForSpecialTopics",
    name: "specialTopics.selectArticles",
    parent: "journal.name",
    title: function () {
        return TAPi18n.__("Special Topics");
    },
    waitOn: function () {
        return [
            Meteor.subscribe('articlesInSpecTopic', this.params.specialTopicsId),
            Meteor.subscribe('journalSpecialTopics', this.params.journalShortTitle),
            Meteor.subscribe('journalIssuesIncludingHistorical', this.params.journalShortTitle)
        ]
    }
});


Router.route('/publisher/:publisherName/journal/:journalShortTitle/guide/Manuscript/:guideId', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (journal) {
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            return journal;
        }
    },
    template: "ShowGuidelines",
    title: function () {
        return TAPi18n.__("Guide for Authors");
    },
    parent: "journal.name",
    name: "guidelines.show",
    waitOn: function () {
        return [
            JournalSubs.subscribe("author_center"),
            JournalSubs.subscribe('files'),
        ]
    }

});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/news/journalNews/:newsId', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (journal) {
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            return journal;
        }
    },
    template: "showNewsArticle",
    title: function () {
        return TAPi18n.__("News");
    },
    parent: "journal.name",
    name: "journalNews.show",
    waitOn: function () {
        return [
            JournalSubs.subscribe('files'),
            Meteor.subscribe('fullNewsPage', this.params.newsId)
        ]
    }
});