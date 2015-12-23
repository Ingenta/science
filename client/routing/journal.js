Router.route('/publisher/:publisherName/journal/:journalShortTitle', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        //if (!Session.get("activeTab"))
        //    Session.set("activeTab", this.params.query.activeTab || "Browse");
        if (journal) {
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            return journal;
        }
    },
    template: "ShowJournal",
    title: function () {
        var id = Session.get('currentJournalId');
        var p = Publications.findOne({_id: id});
        if (!p)return ":journalShortTitle";
        if (TAPi18n.getLanguage() === "en")return p.title || p.titleCn;
        return p.titleCn || p.title;

    },
    parent: "publisher.name",
    name: "journal.name",
    waitOn: function () {
        return [
            Meteor.subscribe('oneJournalIssues', Session.get('currentJournalId')),
            Meteor.subscribe('oneJournalVolumes', Session.get('currentJournalId')),
            Meteor.subscribe('oneJournalArticles', Session.get('currentJournalId'), Session.get('currentIssueId')),
            Meteor.subscribe('about'),
            Meteor.subscribe('about_articles'),
            Meteor.subscribe('allCollections'),
            Meteor.subscribe('medias'),
            Meteor.subscribe('files'),
            Meteor.subscribe('specialTopics'),
            Meteor.subscribe('editorRecommends',Session.get('currentJournalId')),
            Meteor.subscribe("editorial_member"),
            Meteor.subscribe("editorial_board"),
            Meteor.subscribe("author_center"),
            Meteor.subscribe("meeting_info"),
            Meteor.subscribe("news"),
            Meteor.subscribe('mostCited'),
            Meteor.subscribe("recommendedJournalArticles",Session.get('currentJournalId')),
            Meteor.subscribe('mostRead', Session.get('currentJournalId'), 5)
        ]
    },
    onStop:function(){
        Science.dom.clearSelect2Record();
    }
});
Router.route('/publisher/:publisherName/journal/:journalShortTitle/specialTopics/:specialTopicsId', {
    data: function () {
        return SpecialTopics.findOne({_id:this.params.specialTopicsId});
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
            Meteor.subscribe('specialTopics'),
            Meteor.subscribe('oneJournalIssues',Session.get("currentJournalId"))
        ]
    }
});

Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue', {
    data: function () {
        var pub = Publishers.findOne({shortname: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        Session.set("activeTab", "Browse");
        if (journal) {
            var i = Issues.findOne({journalId: journal._id, volume: this.params.volume, issue: this.params.issue});
            if (i !== undefined) {
                Session.set("currentIssueId", i._id);
            }
            Session.set('currentJournalId', journal._id);
            Session.set('currentPublisherId', pub._id);
            return journal;
        }
    },
    template: "ShowJournal",
    name: "journal.name.toc",
    parent: "journal.name",
    title: function () {
        return TAPi18n.__("volumeItem", Router.current().params.volume) + ", " + TAPi18n.__("issueItem", Router.current().params.issue)
    },
    waitOn: function () {
        return [
            Meteor.subscribe('oneJournalIssues', Session.get('currentJournalId')),
            Meteor.subscribe('oneJournalVolumes', Session.get('currentJournalId')),
            Meteor.subscribe('oneJournalArticles', Session.get('currentJournalId'), Session.get('currentIssueId'))
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
            Meteor.subscribe("author_center")
        ]
    }

});