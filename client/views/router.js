Router.configure({
    templateNameConverter: "upperCamelCase",
    routeControllerNameConverter: "upperCamelCase",
    layoutTemplate: "layout",
    notFoundTemplate: "notFound",
    loadingTemplate: "loading",
    progressDelay: 100,
    progressSpinner: false
});

Meteor.subscribe("current_user_data");

Meteor.subscribe("issues");

Meteor.subscribe("about");

Meteor.subscribe("volumes");

Meteor.subscribe("about_articles");

Meteor.subscribe('articleXml');

Meteor.subscribe('pages');

Meteor.subscribe('news');

Meteor.subscribe('images');

Meteor.subscribe('configure');

//Meteor.subscribe('articleViews');

Router.onBeforeAction(function () {
    // loading indicator here
    if (!this.ready()) {
        $("body").addClass("wait");
    } else {
        $("body").removeClass("wait");
        this.next();
    }
});

Router.map(function () {

    this.route("home", {
        path: "/",
        controller: "HomePrivateController",
        title: function () {
            return TAPi18n.__("Home");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles'),
                Meteor.subscribe('articleViews'),
                Meteor.subscribe('images'),
                Meteor.subscribe('news')
            ]
        }
    });
    this.route("topics", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Topics");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('topics')
            ]
        }
    });

    this.route('/topic/:topicQuery', {
        template: "SearchResults",
        parent: "topics",
        title: ":topicQuery",
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles')
            ]
        }
    });

    this.route('/keywords/:keywordsQuery', {
        template: "SearchResults",
        parent: "keywords",
        title: ":keywordsQuery",
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles')
            ]
        }
    });

    this.route("author", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Author");
        }
    });

    this.route('/author/:authorQuery', {
        template: "SearchResults",
        parent: "home",
        title: ":authorQuery",
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles')
            ]
        }
    });

    this.route("collections", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Collections");
        }
    });
    this.route("publications", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publications");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers')
            ]
        }
    });
    this.route("publishers", {
        parent: "home",
        title: function () {
            return TAPi18n.__("Publishers");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications')
            ]
        }
    });

    this.route('/s/:searchQuery', {
        template: "SearchResults",
        parent: "home",
        title: function () {
            return TAPi18n.__("Search");
        },
        waitOn: function () {
            return [
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles')
            ]
        }
    });


    this.route('/publisher/:publisherName', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            if (pub) {
                Session.set('currentPublisherId', pub._id);
                return pub;
            }

        },
        template: "ShowPublisher",
        parent: "publishers",
        title: function () {
            if (TAPi18n.getLanguage() === "en") return ":publisherName";
            var id = Session.get('currentPublisherId');
            var p = Publishers.findOne({_id: id});
            if (p)
                return p.name || p.chinesename;
            return 'NotFound';
        },
        name: "publisher.name",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('publishers')
            ]
        }
    });

    this.route('/publisher/:publisherName/journal/:journalTitle', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (journal) {
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
                return journal;
            }
        },
        template: "ShowJournal",
        title: ":journalTitle",
        parent: "publisher.name",
        name: "journal.name",
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles'),
                Meteor.subscribe('about'),
                Meteor.subscribe('about_articles')
            ]
        }

    });

    this.route('/publisher/:publisherName/journal/:journalTitle/:volume/:issue', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
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
        name: "journal.name.volume",
        parent: "journal.name",
        title: function () {
            return TAPi18n.__("volumeItem", 1) + ", " + TAPi18n.__("issueItem", 1)
        },
        waitOn: function () {
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articles'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('about'),
                Meteor.subscribe('about_articles')
            ]
        }

    });

    this.route('/publisher/:publisherName/journal/:journalTitle/:volume/:issue/:publisherDoi/:articleDoi', {
        data: function () {
            var pub = Publishers.findOne({name: this.params.publisherName});
            var journal = Publications.findOne({title: this.params.journalTitle});
            if (pub) {
                Session.set('currentJournalId', journal._id);
                Session.set('currentPublisherId', pub._id);
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
            return [
                Meteor.subscribe('images'),
                Meteor.subscribe('publishers'),
                Meteor.subscribe('publications'),
                Meteor.subscribe('articleViews'),
                Meteor.subscribe('issues'),
                Meteor.subscribe('articles'),
                Meteor.subscribe('keywords')
            ]
        }
    });


    this.route("testTemplate", {
        path: "/testTemplate"
    });
    this.route("editseaTemp", {
        path: "/editseaTemp"
    });
    this.route("searchResult", {
        path: "/searchResult"
    });
    this.route("loginNew", {
        path: "/loginNew"
    });
    this.route("userAgreement", {
        path: "/userAgreement"
    });
    this.route("publishCont", {
        path: "/publishCont"
    });
    this.route("publishRecommed", {
        path: "/publishRecommed"
    });
    this.route("publishAuthor", {
        path: "/publishAuthor"
    });
    this.route("personal1", {
        path: "/personal1"
    });
    this.route("news", {
        path: "/news"
    });
    this.route("edit_author", {
        path: "/edit_author"
    });
});
