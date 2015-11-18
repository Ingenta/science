Router.route('/publisher/:publisherName/journal/:journalShortTitle/:volume/:issue/:publisherDoi/:articleDoi', {
    data: function () {
        var pub = Publishers.findOne({name: this.params.publisherName});
        var journal = Publications.findOne({shortTitle: this.params.journalShortTitle});
        if (pub) {
            journal && Session.set('currentJournalId', journal._id);
            pub && Session.set('currentPublisherId', pub._id);
            Session.set('currentDoi', this.params.publisherDoi + "/" + this.params.articleDoi);
            return Articles.findOne({doi: this.params.publisherDoi + "/" + this.params.articleDoi});
        }
    },
    template: "showArticle",
    title: function () {
        return TAPi18n.__("Article");
    },
    parent: "journal.name.volume",
    name: "article.show",
    waitOn: function () {
        var artData = this.data();
        var artId;
        if (artData)artId = artData._id;
        return [
            Meteor.subscribe('articleViewsByArticleId', artId),
            Meteor.subscribe('oneIssueArticlesByArticleId',artId),
            Meteor.subscribe('oneJournalIssues', Session.get('currentJournalId')),
            Meteor.subscribe('oneArticleByDoi', Session.get('currentDoi')),
            Meteor.subscribe('relatedArticles', Session.get("relatedArticlesIdList")),
            Meteor.subscribe('keywords'),
            Meteor.subscribe('articleXml'),
            Meteor.subscribe('pdfs'),
            Meteor.subscribe('mostCited'),
            Meteor.subscribe('mostRead')
        ]
    },
    onBeforeAction: function () {
        if (Session.get("ipInChina") === undefined) {
            Meteor.call("ipInChina", function (err, result) {
                console.log(result.country ? result.country.country.cn : "No country found!");
                Session.set("ipInChina", result.code);
            })
        }
        this.next();
    },
    onStop: function () {
        Meteor.clearInterval(Session.get("dynamicRender"));
    }
});