Router.route('/publisher/:publisherName/journal/:journalShortTitle', {
    data: function () {
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        return journal;
    },
    onBeforeAction:function(){
        var journal=this.data();
        if (journal) {
            var pub = Publishers.findOne({shortname: this.params.publisherName});
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            Session.set('baseJournalUrl',"/publisher/"+this.params.publisherName+"/journal/"+this.params.journalShortTitle);
            Science.setActiveTabByUrl(window.location.search, journal.tabSelections, "Overview");

            var latestIssue=Issues.findOne({journalId:journal._id},{sort:{order:-1}});
            latestIssue && Session.set("currentIssueId",latestIssue._id);
            
            var v = Volumes.find({'journalId': journal._id}).fetch();
            var lastVolume = _.sortBy(v, function (oneVolume) {
                return -parseInt(oneVolume.volume, 10);
            })[0];
            lastVolume && Session.set('currentVolumeId',lastVolume._id);
        }
        this.next();
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
        return [
            JournalSubs.subscribe("journalOverviewTab", this.params.journalShortTitle),
            CollectionSubs.subscribe('allCollections'),
            JournalSubs.subscribe('journalBrowseTabVolumeList', this.params.journalShortTitle),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            JournalSubs.subscribe('tag')
        ]
    },
    onStop: function () {
        Science.dom.clearSelect2Record();
    }
});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue', {
    data: function () {
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        return journal;
    },
    onBeforeAction:function(){
        var journal = this.data();
        if (journal) {
            var pub = Publishers.findOne({shortname: this.params.publisherName});
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            Session.set('baseJournalUrl',"/publisher/"+this.params.publisherName+"/journal/"+this.params.journalShortTitle);
            var query={journalId:journal._id};
            query.volume=this.params.volume;
            query.issue=this.params.issue;
            var currentIssue = Issues.findOne(query);
            currentIssue && Session.set("currentIssueId",currentIssue._id);

            var v = Volumes.find({'journalId': journal._id}).fetch();
            var lastVolume = _.sortBy(v, function (oneVolume) {
                return -parseInt(oneVolume.volume, 10);
            })[0];
            lastVolume && Session.set('currentVolumeId',lastVolume._id);

            Science.setActiveTabByUrl(window.location.search, journal.tabSelections, "Browse");
        }
        this.next();
    },
    template: "ShowJournal",
    title: function () {
        var p = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (!p)return ":journalShortTitle";
        if (TAPi18n.getLanguage() === "en")return p.title || p.titleCn;
        return p.titleCn || p.title;

    },
    parent: "publisher.name",
    name: "journal.name.long",
    waitOn: function () {
        return [
            JournalSubs.subscribe("journalOverviewTab", this.params.journalShortTitle),
            CollectionSubs.subscribe('allCollections'),
            JournalSubs.subscribe('journalBrowseTabVolumeList', this.params.journalShortTitle),
            JournalSubs.subscribe('medias'),
            JournalSubs.subscribe('files'),
            JournalSubs.subscribe('tag')
        ]
    },
    onStop: function () {
        Science.dom.clearSelect2Record();
    }
});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/specialTopics/postArticles/:specialTopicsId', {
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
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (journal) {
            Session.set('currentJournalId', journal._id);
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
            Meteor.subscribe('AuthorCenterPage', this.params.guideId,this.params.journalShortTitle)
            //JournalSubs.subscribe('files')
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